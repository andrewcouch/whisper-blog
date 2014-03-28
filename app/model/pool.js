//Encapsulates the pool feature of MySQL

var mysql = require('mysql');
var q = require('q');
var config = require('./config');

var pool  = mysql.createPool({
    host     : config.host,
    user     : config.dbuser,
    password : config.dbpass,
    database : config.db
});

//Returns a promise for a connection
module.exports = function() {
    return q.ninvoke(pool, "getConnection");
};