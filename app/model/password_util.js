/* private encryption & validation methods */
var crypto = require('crypto');
var q = require('q');

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

//Returns a salted and hashed password(Synchronus)
module.exports.saltAndHash = function(pass)
{
	var salt = generateSalt();
	var hash = salt + md5(pass + salt);
	return salt + md5(pass + salt);
}

//Returns a resolved Promise(true) if password valid, otherwise a rejected Promise
module.exports.validate = function(plainPass, hashedPass)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	if (hashedPass === validHash){
		return q(true);
	}else{
		return q.reject("Invalid Password");
	}
}
