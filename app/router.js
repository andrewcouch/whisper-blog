var headerjwt = require('express-jwt');
var config = require('./model/config');
//var checkrole = require('./model/checkrole');
var cookiejwt = require('./model/cookie-jwt');

var userroutes = require('./user_routes.js');
var postroutes = require('./post_routes.js');
var staticroutes = require('./static_routes.js');

module.exports = function(app)
{
	app.get('/', staticroutes.render_login);
	app.get('/account', cookiejwt({secret: config.secret}), userroutes.render_user_view);
	app.get('/home', cookiejwt({secret: config.secret}), postroutes.render_home_view);
	app.get('/post/:id', postroutes.render_single_post);

	app.post('/api/user/login',	userroutes.api_user_login);
	app.post('/api/user/create', userroutes.api_user_create);
	app.post('/api/user/remove', headerjwt({secret: config.secret}), userroutes.api_user_remove);
	app.get('/api/user/view', headerjwt({secret: config.secret}), userroutes.api_user_view_self);

	app.post('/api/post/create', headerjwt({secret: config.secret}), postroutes.api_post_create);
	app.get('/api/post/get/:id', postroutes.api_single_post);

//Handle Errors
	app.use(staticroutes.render_error);
	app.use(staticroutes.render_404);
}