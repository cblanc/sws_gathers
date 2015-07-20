"use strict";

var helper = require("./helpers/index.js");
var request = require("supertest");
var app = helper.app;

describe("Basic Spec", function () {
	it ("returns 200", function (done) {
		request(app)
			.get("/")
			.expect(200)
			.end(done);
	});

	it ("returns 404 if page not found", function (done) {
		request(app)
			.get("/foo")
			.expect(404)
			.end(done);
	});
});