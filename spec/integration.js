"use strict";

var helper = require("./helpers/index.js");
var request = require("supertest");
var assert = require("chai").assert;
var app = helper.app;

describe("Basic Spec", () => {
	it ("serves main page", done => {
		request(app)
			.get("/")
			.expect(200)
			.end(done);
	});

	it ("returns 404 if page not found", done => {
		request(app)
			.get("/foo")
			.expect(404)
			.end(done);
	});
});

describe("Gathers API", () => {
	describe("gathers/current", () => {
		it ("returns the current gather", done => {
			request(app)
				.get("/gathers/current")
				.expect(200)
				.end((error, response) => {
					if (error) return done(error);
					assert.equal(response.body.gatherers.length, 0);
					assert.equal(response.body.state, 'gathering');
					done();
				});
		});
	});
});