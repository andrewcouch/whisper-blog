var user = require('./model/user');

exports.api_user_login = function(req, res) {
    
	user.login(req.body)
	.done(
		function(token){
			res.cookie('token',token);
			res.json({token:token});
		},
		function(err){
			res.clearCookie('token');
			res.json({error:"Login Error."});
			res.send(401);
		});
};

exports.api_user_create = function(req,res){

	user.create_account(req.body)
	.done(function(token){
			res.cookie('token',token);
			res.json({token:token});
		},function(err){				
			res.clearCookie('token');
			res.json({error:err});
		});
};

exports.api_user_remove = function(req,res){

	user.remove_account(req.body)
	.done(function(result){
			res.json({success:result});
		},function(err){
			res.json({error:err});
		});
};

exports.api_user_view_self = function(req,res){

	user.load_account(req.user)
	.done(function(result){
			res.json({user:result});
		},function(err){
			res.json({error:err});
		});
};

exports.render_user_view = function(req, res){
	user.load_account(req.user)
	.done(function(result){
			res.render('account', result);
		},function(err){
			res.render('account', {error:err});
		});
};