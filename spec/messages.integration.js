"use strict";

const async = require("async");
const request = require("supertest");
const assert = require("chai").assert;
const helper = require("./helpers/index.js");
const Message = helper.Message;

const app = helper.app;
let user, messages;

describe("Messages", () => {
	before(done => {
		user = helper.createUser();
		helper.clearDb(done);
	});

	beforeEach(done => {
		messages = [];
		async.timesSeries(6, (n, next) => {
			Message.create({
				author: {
					username: user.username,
					avatar: user.avatar
				},
				content: "Message " + n
			}, (error, message) => {
				if (error) return next(error);
				messages.push(message);
				next();
			});
		}, done);
	});

	afterEach(done => {
		helper.clearDb(done);
	});


	describe("#Index", () => {
		describe("JSON Api", () => {
			it ("returns most recent messages", done => {
				request(app)
					.get("/messages")
					.set("Accept", "application/json")
					.expect("Content-Type", /json/)
					.expect(200)
					.end((error, response) => {
						if (error) return done(error);
						let result = response.body;
						assert.equal(result.messages.length, 6);
						assert.equal(result.limit, 250);
						assert.equal(result.page, 0);
						done();
					});
			});
			it ("is sensitive to limit", done => {
				request(app)
					.get("/messages")
					.query({
						limit: 1
					})
					.set("Accept", "application/json")
					.expect("Content-Type", /json/)
					.expect(200)
					.end((error, response) => {
						if (error) return done(error);
						let result = response.body;
						assert.equal(result.messages.length, 1);
						assert.equal(result.limit, 1);
						assert.equal(result.page, 0);
						assert.equal(result.messages[0].content, "Message 5");
						done();
					});
			});
			it ("returns a maximum of last 250 messages");
			it ("is sensitive to pagination", done => {
				request(app)
					.get("/messages")
					.query({
						limit: 1,
						page: 2
					})
					.set("Accept", "application/json")
					.expect("Content-Type", /json/)
					.expect(200)
					.end((error, response) => {
						if (error) return done(error);
						let result = response.body;
						assert.equal(result.messages.length, 1);
						assert.equal(result.limit, 1);
						assert.equal(result.page, 2);
						assert.equal(result.messages[0].content, "Message 3");
						done();
					});
			});
			it ("is sensitive to search terms", done => {
				request(app)
					.get("/messages")
					.query({
						query: "5"
					})
					.set("Accept", "application/json")
					.expect("Content-Type", /json/)
					.expect(200)
					.end((error, response) => {
						if (error) return done(error);
						let result = response.body;
						assert.equal(result.messages.length, 1);
						assert.equal(result.limit, 250);
						assert.equal(result.page, 0);
						assert.equal(result.messages[0].content, "Message 5");
						done();
					});
			});
		});

		describe("HTML Browser", () => {
			it ("renders message browser", done => {
				request(app)
					.get("/messages")
					.set("Accept", "text/html; charset=utf-8")
					.expect("Content-Type", /html/)
					.expect(200)
					.end((error, response) => {
						if (error) return done(error);
						assert.include(response.text, "Message Browser");
						done();
					});
			})
		});
	});
});
