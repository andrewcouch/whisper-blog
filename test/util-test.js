var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var util = require('../app/model/util');
var passwordutil = require('../app/model/password_util');

describe('Util',function(){
	describe('Build User', function(){
		it('should return email and password unchanged when only they are sent in.', function(done){
			expect(expect(util.build_user({email:"test@test.com",password:"password"}))
				.to.be.fulfilled.then(function(result){
					expect(result).to.have.property("email","test@test.com")
					expect(result).to.have.property("password","password")
			})).notify(done);
		});
		it('should remove extra attributes.', function(done){
			expect(expect(util.build_user({extra:"info", email:"test@test.com",password:"password"}))
				.to.be.fulfilled.then(function(result){
				expect(result).to.property("email","test@test.com")
				expect(result).to.have.property("password","password")
				expect(result).to.not.have.property("extra");
			})).notify(done);
		});	
		it('should not attempt to hash an empty password.', function(){
			return expect(util.build_user({extra:"info", email:"test@test.com"}))
				.to.become({email:"test@test.com"});
		});
	});
	describe('Check has password',function(){
		it('should return input if the password property exists.',function(){
			return expect(util.check_has_password({password:"hhdh"}))
				.to.become({password:"hhdh"});
		});
		it('should return a user if the password property does not exist.',function(){
			return expect(util.check_has_password({nope:"hhdh"}))
				.to.be.rejectedWith("Missing Password");
		});		
	});
});