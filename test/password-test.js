var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var passwordutil = require('../app/model/password_util');

describe('Password functions', function(){
  describe('SaltAndHash', function(){
    it('should salt and hash a password that can be validated', function(){
    	var password = "password";
    	var hashedpassword = passwordutil.saltAndHash(password);
    	expect(hashedpassword).to.have.length(42);
    	return expect(passwordutil.validate(password,hashedpassword)).to.eventually.be.ok;
    })
  })
})