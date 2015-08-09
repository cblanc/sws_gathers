"use strict";

var helper = require("./helpers/index.js");
var Message = helper.Message;
var assert = require("chai").assert;
var async = require("async");

describe("Message Model", function () {
	var user;

	before(function (done) {
		user = helper.createUser();
		helper.clearDb(done);
	});

	afterEach(function (done) {
		helper.clearDb(done);
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

	describe(".list", function () {
		beforeEach(function (done) {
			var instructions = [helper.clearDb.bind(null)];
			for (var i = 0; i < 31; i++) {
				instructions.push(function (content) {
					return function (callback) {
						return helper.createMessage({content: content}, callback);
					}
				}(i));
			}
			async.series(instructions, done);
		});
		it ("lists last 30 messages with oldest first", function (done) {
			Message.list({}, function (error, messages) {
				if (error) return done(error);
				assert.equal(messages.length, 30);
				assert.isTrue(messages.reduce(function (acc, message, index, arr) {
					if (index === 0) return true;
					if (acc === false) return false;
					return arr[index - 1].createdAt <= message.createdAt; 
				}));
				assert.isTrue(messages.some(function (message) {
					return message.content === "30";
				}));
				done();
			});
		});
		it ("does not list deleted messages", function (done) {
			helper.createMessage({
				content: "FOOBAR"
			}, function(error, message) {
				if (error) return done(error);
				message.deleted = true;
				message.save(function (error, message) {
					if (error) return done(error);
					assert.isTrue(message.deleted);
					Message.list({}, function (error, messages) {
						assert.isTrue(messages.every(function (elem) {
							return elem.id !== message.id;
						}));
						done();
					});
				});
			});
		});
	});
});