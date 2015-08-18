"use strict";

var helper = require("./helpers/index.js");
var Session = helper.Session;
var assert = require("chai").assert;
var async = require("async");

describe("Session model", function () {
	describe(".create", function () {
		var session;
		beforeEach(function () {
			session = { userId: Math.floor(Math.random() * 10000) };
		});
		it ("creates a new session", function (done) {
			Session.create(session, function (error, result) {
				if (error) return done(error);
				assert.equal(result.userId, session.userId);
				assert.isString(result.key);
				done();
			});
		});
	});
});