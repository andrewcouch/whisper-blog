var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var post = require('../app/model/post');

describe('Post Functions', function(){
	describe('Create Post',function(){
		it('should create a test post.',function(){
			return expect(post.create({title:"test",body:"body"},{id:1, email:"info@andrew-couch.com"}))
			.to.eventually.be.a("number");
		});
	});
	describe('Load Post',function(){
		it('should load the test post by id.',function(){
			return expect(post.load_by_id(1))
			.to.eventually.have.property("title","test");
		});
		it('should load the test post by author.',function(){
			return expect(post.load_posts({author_id:1}))
			.to.eventually.have.length.above(1);
		});
		it('should load the top ten posts.',function(){
			return expect(post.load_posts({num:10,orderby:"date",orderdir:"desc"}))
			.to.eventually.have.length.above(1);
		});
		it('should load the next ten posts.',function(){
			return expect(post.load_posts({num:10,since:1,seen:0,orderby:"date",orderdir:"desc"}))
			.to.eventually.have.length.above(1);
		});			
	});		
});