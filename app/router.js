var headerjwt = require('express-jwt');
var config = require('./model/config');
//var checkrole = require('./model/checkrole');
var cookiejwt = require('./model/cookie-jwt');

var userroutes = require('./api_user_routes.js');  

module.exports = function(app)
{
	app.get('/', function(req, res){
		res.render('login', {title:'Home'});
	});
	app.get('/account', cookiejwt({secret: config.secret}), userroutes.user_view);

	app.post('/api/user/login',	userroutes.api_user_login);
	app.post('/api/user/create', userroutes.api_user_create);
	app.post('/api/user/remove', headerjwt({secret: config.secret}), userroutes.api_user_remove);
	app.get('/api/user/view', headerjwt({secret: config.secret}), userroutes.api_user_view_self);

	app.use(function(err, req, res, next) {
	    console.log('Error occured:', err);
	    var template = '500',
	    	errstatus = 500;

	    if (err.status==401){
	    	errstatus = 401;
	    	template = '401';
	    }
	    res.status(errstatus);
	    res.render(template, err);
	});

	// Handle 404
	app.use(function(req, res) {
		res.status(404);
		res.render('404', {title: '404: File Not Found'});
	});
}