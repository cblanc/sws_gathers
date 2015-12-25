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

	describe("#toggleMapVote", function () {
		it ("assigns vote for map id", function () {
			assert.equal(gatherer.mapVote.length, 0);
			gatherer.toggleMapVote(1);
			assert.isTrue(gatherer.mapVote.some(voteId => voteId === 1));
		});
		it ("removes map vote if toggled twice", function () {
			gatherer.toggleMapVote(1);
			gatherer.toggleMapVote(1);
			assert.equal(gatherer.mapVote.length, 0);
		});
		it ("allows a maximum of 2 votes", function () {
			gatherer.toggleMapVote(1);
			gatherer.toggleMapVote(2);
			gatherer.toggleMapVote(3);
			assert.equal(gatherer.mapVote.length, 2);
		});
		it ("removes oldest vote if maximum vote exceeded", function () {
			gatherer.toggleMapVote(1);
			gatherer.toggleMapVote(2);
			gatherer.toggleMapVote(3);
			assert.isFalse(gatherer.mapVote.some(voteId => voteId === 1));
			assert.isTrue(gatherer.mapVote.some(voteId => voteId === 2));
			assert.isTrue(gatherer.mapVote.some(voteId => voteId === 3));
		});
	});

	describe("#toggleServerVote", function () {
		it ("assigns vote for server id", function () {
			assert.equal(gatherer.serverVote.length, 0);
			gatherer.toggleServerVote(1);
			assert.isTrue(gatherer.serverVote.some(voteId => voteId === 1));
		});
		it ("removes server vote if toggled twice", function () {
			gatherer.toggleServerVote(1);
			gatherer.toggleServerVote(1);
			assert.equal(gatherer.serverVote.length, 0);
		});
		it ("allows a maximum of 2 votes", function () {
			gatherer.toggleServerVote(1);
			gatherer.toggleServerVote(2);
			gatherer.toggleServerVote(3);
			assert.equal(gatherer.serverVote.length, 2);
		});
		it ("removes oldest vote if maximum vote exceeded", function () {
			gatherer.toggleServerVote(1);
			gatherer.toggleServerVote(2);
			gatherer.toggleServerVote(3);
			assert.isFalse(gatherer.serverVote.some(voteId => voteId === 1));
			assert.isTrue(gatherer.serverVote.some(voteId => voteId === 2));
			assert.isTrue(gatherer.serverVote.some(voteId => voteId === 3));
		});
	});

	describe("#voteForLeader", function () {

	});
});