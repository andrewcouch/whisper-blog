var q = require('q');
var pool = require('./pool');
var util = require('./util');

exports.create = function(input, user){
	var post = {};
	return util.build_post(input,user)
	.then(function(cleaned_post){
		post = cleaned_post;
	})
	.then(pool)
	.then(function(conn){
		return q.ninvoke(conn,"query","insert into post set ?",post)
			.spread(function(result){
				var promise = q.defer();
				if (result.affectedRows==1){
					promise.resolve(result.insertId);
				}else{
					promise.reject("Affected Rows:" + result.affectedRows);
				}
				return promise.promise;
			})
			.then(function(id){
				return id;
			})
			.finally(function(){
				conn.release();		
			});
	});
};

exports.load_by_id = function(id){
	return pool()
	.then(function(conn){
		return q.ninvoke(conn,"query","select * from post where id=?",id)
			.spread(function(rows){
				var promise = q.defer();
				if (rows.length==0){
					promise.resolve({});
				}else{
					promise.resolve(rows[0]);
				}
				return promise.promise;
			})
			.finally(function(){
				conn.release();		
			});
	});
};

exports.load_posts = function(search){
	var sql;
	return util.build_postsearch_sql(search)
	.then(function(searchsql){
		sql = searchsql;
	})
	.then(pool)
	.then(function(conn){
		return q.ninvoke(conn,"query",sql)
			.spread(function(rows){
				var promise = q.defer();
				if (rows.length==0){
					promise.resolve({});
				}else{
					promise.resolve(rows);
				}
				return promise.promise;
			})
			.finally(function(){
				conn.release();		
			});
	});
};