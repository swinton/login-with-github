// server.js
// where your node app starts

// for HTTP request
const axios = require('axios');

// for web framework
const express = require('express');
const app = express();

// for session storage
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// for template rendering
const nunjucks = require('nunjucks');

// for GitHub API
const Octokit = require('@octokit/rest');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init our file-based session storage
app.use(session({
  store: new FileStore({
    path: '/app/.data',
    ttl: 86400,
  }),
  secret: process.env.SESSION_STORE_SECRET
}));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  if (request.session.views) {
    request.session.views += 1;
  } else {
    request.session.views = 1;
  }
  
  // for OAuth authorzations
  const code = request.query.code;
  const state = request.query.state;
  if (code && state) {
    // exchange for token
    axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      state: 
    });
  } 
  
  if (request.session.token) {
    // instantiate client with token
  }

  // render and send the page
  response.send(nunjucks.render(
    'views/index.html',
    {
      'state': request.query.state || false, 
      'title': process.env.TITLE,
      'installation_id': request.query.installation_id,
      'setup_action': request.query.setup_action,
    }
  ));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
