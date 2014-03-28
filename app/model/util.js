var q = require('q');
var passwordutil = require('./password_util');
var _ = require('underscore');

//Returns promise of a checked user. Rejects if "hashedpassword" is missing
exports.check_has_password = function(user)
{
	var promise = q.defer();
	if (user.password){
		promise.resolve(user);
	}else{
		promise.reject("Missing Password");
	}
	return promise.promise;
}
//Returns promise for a cleaned user, must have e-mail or throws error.
exports.build_user = function(input){
	var promise = q.defer();
	var user = {};
	
	user.email = input.email;

	if (input.password)
	{
		user.password = input.password;
	}

	if (user.email){
		promise.resolve(user);
	}else{
		promise.reject("Missing E-Mail");
	}
	
	return promise.promise;
};

//Reject is more than one affected row is reported
exports.check_single_update_occured = function(result){
	var promise = q.defer();
	if (!result.affectedRows)
	{
		promise.reject(result);
	} else if (result.affectedRows==1){
		promise.resolve();
	}else{
		promise.reject("Affected Rows:" + result.affectedRows);
	}
	return promise.promise;
}

//Returns promise for a cleaned post.
exports.build_post = function(input){
	var promise = q.defer();
	var post = {};
	
	post.title = input.title;
	post.url = input.url;
	post.body = input.body;
	post.author_id = input.author_id;
	post.posttime = new Date();

	promise.resolve(post);

	return promise.promise;
}

//{max:10,since:10,seen:10,orderby:"posttime",orderdir:"desc", author_id}
exports.build_postsearch_sql = function(search){
	var promise = q.defer();

	var sql = "select id,title,body,author_id,url,posttime from post",
		max = parseInt(search.max) || 10,
		orderby = search.orderby || "posttime",
		orderdir = search.orderdir=="asc"?"asc":"desc",
		where = [];

	if (!_.contains(["posttime"],orderby))
	{
		orderby = "posttime";
	}
	if (_.isNumber(search.author_id) && !_.isNaN(search.author_id))
	{
		where.push("author_id = " + search.author_id);
	}
	if (_.isNumber(search.since) && !_.isNaN(search.since)){
		where.push("id > " + search.since);
	}
	if (_.isNumber(search.seen) && !_.isNaN(search.seen)){
		where.push("id < " + search.seen);
	}
	if (where.length > 0)
	{
		sql += " where " + where.join(" and ");
	}
	sql += " order by " + orderby + " " + orderdir + " limit 0," + max;
	promise.resolve(sql);
	return promise.promise;	
}