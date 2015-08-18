"use strict";

var helper = require("./helpers/index.js");
var request = require("supertest");
var app = helper.app;

describe("Basic Spec", function () {
	it ("redirects if user is not authenticated", function (done) {
		request(app)
			.get("/")
			.expect(302)
			.end(done);
	});

	it ("returns 404 if page not found", function (done) {
		request(app)
			.get("/foo")
			.expect(404)
			.end(done);
	});
});