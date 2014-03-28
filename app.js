var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var app = express();

app.set('port', process.env.PORT || 3000);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/view');
app.locals.pretty = true;
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
require('./app/router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});