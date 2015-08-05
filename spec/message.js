"use strict";

var helper = require("./helpers/index.js");
var Message = helper.Message;
var assert = require("chai").assert;

describe("Message Model", function () {
	var user;

	before(function (done) {
		helper.clearDb(done);
	});

	after(function (done) {
		helper.clearDb(done);
	});

	beforeEach(function () {
		user = helper.createUser();
	});

	describe(".create", function () {
		it ("creates a new message with an author", function (done) {
			var content = "Foo";
			Message.create({
				author: {
					username: user.username,
					avatar: user.avatar
				},
				content: content
			}, function (error, result) {
				if (error) return done(error);
				assert.equal(result.author.username, user.username);
				assert.equal(result.author.avatar, user.avatar);
				assert.equal(result.content, content);
				assert.isDefined(result.createdAt);
				done();
			});
		});
	});
});