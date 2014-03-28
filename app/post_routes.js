var post = require('./model/post');

exports.api_post_create = function(req,res){

	post.create(req.body, req.user)
	.done(function(id){
			res.json({success:id});
		},function(err){				
			res.json({error:err});
		});
};

exports.api_single_post = function(req,res){

	var id = req.params.id;
	post.load_by_id(id)
	.done(function(id){
			res.json({success:id});
		},function(err){				
			res.json({error:err});
		});
};

exports.render_single_post = function(req,res){
	var id = req.params.id;
	post.load_by_id(id)
	.done(function(result){
			res.render('single', {post:result});
		},function(err){
			res.render('single', {error:err});
		});
};

exports.render_home_view = function(req,res){
	var search = {author_id:req.user.id};

	post.load_posts(search)
	.done(function(result){
			res.render('home', {posts:result});
		},function(err){
			res.render('home', {error:err});
		});
}