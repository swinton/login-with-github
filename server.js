// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const nunjucks = require('nunjucks');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

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
  
  
  // render and send the page
  response.send(nunjucks.render(
    'views/index.html',
    {
      'state': request.query.state || false, 
      'title':process.env.TITLE }
  ));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
