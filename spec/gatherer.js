"use strict";

var helper = require("./helpers/index.js");
var User = helper.User;
var Gather = helper.Gather;
var Gatherer = helper.Gatherer;
var assert = require("chai").assert;

describe("Gather Model:", function () {
	var user, gatherer;

	beforeEach(function () {
		user = helper.createUser();
		gatherer = new Gatherer(user);
	});

	describe("#voteRegather", function () {
		it ("marks gatherer as voting for regather", function () {
			assert.isFalse(gatherer.regatherVote);
			gatherer.voteRegather();
			assert.isTrue(gatherer.regatherVote);
		});
		it ("assigns vote for regather", function () {
			gatherer.voteRegather(true);
			assert.isTrue(gatherer.regatherVote);
			gatherer.voteRegather(false);
			assert.isFalse(gatherer.regatherVote);
		});
	});

	describe("#voteForMap", function () {

	});

	describe("#voteForLeader", function () {

	});
});