var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var user = require('../app/model/user');
var passwordutil = require('../app/model/password_util');

describe('User',function(){
	describe('Create Account',function(){
		it('should return a token for the newly created user.',function(){
			return expect(user.create_account({email:"test@test.com",password:"password"}))
				.to.eventually.be.a("string");
		});
	});
	describe('Load Account',function(){
		it('should return user for found account.', function(){
			return expect(user.load_account({email:"test@test.com"}))
				.to.eventually.be.a("object")
				.with.property("email","test@test.com");
		});
		it('should reject promise if accuont not there.',function(){
			return expect(user.load_account({email:"test_nonsense@test.com"}))
				.to.be.rejectedWith("No such user.");
		});
	});	
	describe('Login',function(){
		it('should return a token for the newly logged in user.',function(){
			return expect(user.login({email:"test@test.com",password:"password"}))
				.to.eventually.be.a("string");
		});
	});
	describe('Delete Account',function(){	
		it('should return true for deleted account.', function(){
			return expect(user.remove_account({email:"test@test.com",password:"password"}))
				.to.be.fulfilled;
		});
		it('should actually delete account. (Account should not be there anymore.)',function(){
			return expect(user.load_account({email:"test@test.com"}))
				.to.be.rejectedWith("No such user.");
		});
	});	
});