"use strict";

var helper = require("./helpers/index.js");
var request = require("supertest");
var assert = require("chai").assert;
var app = helper.app;

describe("Messages", () => {
	beforeEach(done => {
		done();
	});

	afterEach(done => {
		done();
	});
	describe("#Index", () => {
		describe("JSON Api", () => {
			it ("returns most recent messages");
			it ("is sensitive to limit");
			it ("returns a maximum of last 250 messages");
			it ("is sensitive to pagination");
			it ("is sensitive to user");
			it ("is sensitive to search terms");
		});
		describe("HTML Browser", () => {
			it ("renders message browser", done => {
				request(app)
					.get("/messages")
					.set("Accept", "text/html; charset=utf-8")
					.expect('Content-Type', /html/)
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
