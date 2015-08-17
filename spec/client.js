"use strict";

var helper = require("./helpers/index.js");
var EnslClient = helper.EnslClient;
var assert = require("chai").assert;
var fs = require("fs");
var path = require("path");
var sessionString = (new Buffer(fs.readFileSync(path.join(__dirname, "helpers/data/session.txt"))).toString('ascii'));

describe("ENSL Client", function () {
	describe (".decodeSession", function () {
		it ("decodes an ENSL session", function () {
			var output = EnslClient.decodeSession(sessionString);
			assert.isDefined(output.parsed);
		});
		it ("returns null if invalid cookie format", function () {
			assert.isNull(EnslClient.decodeSession("foo"));
		});
		it ("returns null if invalid JSON", function () {
			var invalidSession = "Zm9v%0A--b4794ad68b095b5ee06381e58e97a9c0cb243ede";
			assert.isNull(EnslClient.decodeSession(invalidSession));
		});
		it ("returns null if signature is invalid", function () {
			var invalidSessionString = sessionString + "foo";
			assert.isNull(EnslClient.decodeSession(invalidSessionString));
		});
	});
});