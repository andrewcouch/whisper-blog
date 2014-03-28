var q = require('q');
var util = require('./util');
var passwordutil = require('./password_util');
var pool = require('./pool');
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.create_account = function(input){
	var user = {};
	return util.build_user(input)
	.then(util.check_has_password)
	.then(function(cleaned_user){
		user = cleaned_user;
		user.updatedate = new Date();
		user.password = passwordutil.saltAndHash(user.password);
	})
	.then(pool)
	.then(function(conn){
		return q.ninvoke(conn,"query","insert into account set ?",user)
			.spread(function(result){
				var promise = q.defer();
				if (result.affectedRows==1){
					promise.resolve();
				}else{
					promise.reject("Affected Rows:" + result.affectedRows);
				}
				return promise.promise;
			})
			.then(function(){
				return make_token(user);
			})
			.finally(function(){
				conn.release();		
			});
	});
}

exports.load_account = function(input){
	var email = input.email;
	return pool()
	.then(function(conn){
		return q.ninvoke(conn,"query","select id,email,updatedate from account where email=?",email)
			.spread(function(rows){
				var promise = q.defer();
				if (rows.length==0){
					promise.reject("No such user.");
				}else{
					promise.resolve(rows[0]);
				}
				return promise.promise;
			})
			.finally(function(){
				conn.release();		
			});
	});
}

exports.remove_account = function(input){
	var email = input.email;
	return pool()
	.then(function(conn){
		return q.ninvoke(conn,"query","delete from account where email=?",email)
			.spread(function(result){
				var promise = q.defer();
				if (result.affectedRows==1){
					promise.resolve();
				}else{
					promise.reject("Affected Rows:" + result.affectedRows);
				}
				return promise.promise;
			})
			.finally(function(){
				conn.release();		
			});
	});
}

exports.login = function(input){
	var user = {};
	return util.build_user(input)
	.then(util.check_has_password)
	.then(function(cleaned_user){user = cleaned_user;})
	.then(pool)
	.then(function(conn){
		return q.ninvoke(conn,"query","select password from account where email=?",	user.email)
			.spread(function(rows){
				var promise = q.defer();
				if (rows.length==0){
					promise.reject("No user found.")
				}else{
					promise.resolve(rows[0].password);
				}
				return promise.promise;
			})
			.then(function(hashedpassword){
				return passwordutil.validate(user.password,hashedpassword)
			})
			.finally(function(){
				conn.release();		
			});
	})
	.then(
		function(){
		            return make_token(user);
	            });	
}

function make_token(user){
	var tokenizeduser = {	id:user.id,
							email:user.email};
	return jwt.sign(tokenizeduser, config.secret, { expiresInMinutes: 60 });
}