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
    
    }),
    secret: 'keyboard cat'
}));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.send(nunjucks.render(
    'views/index.html',
    { 'state': request.query.state || false, 'title':process.env.TITLE }
  ));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
