"use strict";

var helper = require("./helpers/index.js");
var EnslClient = helper.EnslClient;
var assert = require("chai").assert;
var fs = require("fs");
var path = require("path");
var sessionString = (new Buffer(fs.readFileSync(path.join(__dirname, "helpers/data/session.txt"))).toString('ascii'));

describe("ENSL Client", function () {
	describe (".decodeSession", function () {
		it ("decodes an ENSL session", function (done) {
			EnslClient.decodeSession(sessionString, function (error, userId) {
				if (error) return done(error);
				assert.isNotNull(userId);
				done();
			});
		});
		it ("returns an error invalid cookie format", function (done) {
			EnslClient.decodeSession("foo", function (error, userId) {
				assert.isNull(userId);
				assert.match(error.message, /invalid/ig);
				done();
			});
		});
		it ("returns null if invalid JSON", function (done) {
			var invalidSession = "Zm9v%0A--b4794ad68b095b5ee06381e58e97a9c0cb243ede";
			EnslClient.decodeSession(invalidSession, function (error, userId) {
				assert.isNull(userId);
				assert.match(error.message, /invalid/ig);
				done();
			});
		});
		it ("returns null if signature is invalid", function (done) {
			var invalidSessionString = sessionString + "foo";
			EnslClient.decodeSession(invalidSessionString, function (error, userId) {
				assert.isNull(userId);
				assert.match(error.message, /invalid/ig);
				done();
			});
		});
	});
});