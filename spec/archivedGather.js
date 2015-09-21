"use strict";

var helper = require("./helpers/index.js");
var Gather = helper.Gather;
var ArchivedGather = helper.ArchivedGather;
var assert = require("chai").assert;
var async = require("async");

var generateCompletedGather = () => {
	var user, gather, gatherers;
	user = helper.createUser();
	gatherers = [];
	for (var i = 0; i < 12; i++)
	gatherers.push(helper.createUser());
	gather = Gather();

	// Add gatherers
	gatherers.forEach((gatherer) => {
		gather.addGatherer(gatherer);
	});

	// Assign votes
	let leaderA = gatherers[0];
	let leaderB = gatherers[1];
	gatherers.forEach((voter, index) => {
		if (index % 2 === 0) {
			gather.selectLeader(voter, leaderA);
		} else {
			gather.selectLeader(voter, leaderB);
		}
	});

	// Assign teams
	gatherers.forEach((gatherer, index) => {
		if (gatherer.leader) return;
		if (index % 2 === 0) {
			gather.moveToAlien(gatherer);
		} else {
			gather.moveToMarine(gatherer);
		}
	});
	gather.confirmSelection();
	assert.equal(gather.current, "done");
	return gather;
}

describe("ArchivedGather", () => {
	var gather;

	beforeEach(() => {
		gather = generateCompletedGather();
	});

	describe("Create", () => {
		it ("creates an archived gather", () => {
			ArchivedGather.create({
				gather: gather.toJson()
			}, (error, result) => {
				if (error) return done(error);
				assert.isDefined(result.createdAt);
				let gather = result.gather;
				assert.equal(gather.gatherers.length, 12);
				assert.equal(gather.state, "done");
				done();
			});
		});
	});
});