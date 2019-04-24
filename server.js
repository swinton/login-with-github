// server.js
// where your node app starts

// for web framework
const express = require('express');
const app = express();

// nunjucks for template rendering
// https://mozilla.github.io/nunjucks/getting-started.html
const nunjucks = require('nunjucks');
nunjucks.configure('/app/views', {
  express: app,
  autoescape: true,
  noCache: true
});
app.set('view engine', 'html');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init our file-based session storage
const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
  store: new FileStore({
    path: '/app/.data',
    ttl: 86400,
  }),
  resave: false,
  secret: process.env.SESSION_STORE_SECRET
}));

// for GitHub API
const Octokit = require('@octokit/rest');

// for OAuth authorization "state" generation
const crypto = require('crypto');

// for HTTP request
const axios = require('axios');
// (...we want JSON by default)
axios.defaults.headers.common['Accept'] = 'application/json';

// for general utilities
const _ = require('lodash');

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', async function(request, response) {
  let viewData = {},
      github;

  if (request.session.token) {
    // instantiate client with token
    github = new Octokit({
      auth: request.session.token
    });
    
    // get authenticated user
    const currentUser = await github.users.getAuthenticated();
    console.log('current user: %j', currentUser);
    
    // expose authenticated user to template via viewData
    viewData.user = currentUser.data;
  }

  // render and send the page
  response.render('index', {
    'state': request.query.state || false, 
    'title': process.env.TITLE,
    ...viewData
  });
});

app.get('/login', async function(request, response) {
  // generate a random state
  const state = crypto.createHmac('sha1', process.env.CLIENT_SECRET)
    .update(Math.random().toString())
    .digest('hex').substring(0, 8);

  return response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${state}`);
});

app.get('/logout', async function(request, response) {
  // delete the token
  delete request.session.token;
  
  // go home
  return response.redirect(`/`);
});

// for completing OAuth authorization flow
app.get('/sup', async function(request, response) {
  const code = request.query.code;
  const state = request.query.state;
  if (code) {
    // exchange for token
    // per, https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
    const token = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      state: state,
      redirect_uri: process.env.REDIRECT_URI
    });

    console.log('preserving token: %j', token.data);
    
    // preserve token in session storage
    request.session.token = token.data.access_token;
    
    // redirect home, preserve state
    return response.redirect(`/?state=${state}`);
  }
  
  // not found
  response.status(404).send('Not found');
});

app.get('/register', async function(request, response) {
  if (request.session.token) {
    // instantiate client with token
    const github = new Octokit({
      auth: request.session.token
    });
    
    // get user emails
    const emails = await github.users.listEmails();
    
    // get primary email
    const primary = _(emails.data).filter({primary: true}).head();
    console.log('primary email for user: %j', primary.email);

    return response.redirect('/?registered=true');
  } else {
    return response.redirect('/login');
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
