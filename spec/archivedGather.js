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

	before(done => helper.clearDb(done));

	afterEach(done => helper.clearDb(done))

	beforeEach(() => {
		gather = generateCompletedGather();
	});

	describe("Create", () => {
		it ("creates an archived gather", done => {
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

	describe(".archive", () => {
		it ("archives a gather instance", done => {
			ArchivedGather.archive(gather, (error, result) => {
				if (error) return done(error);
				assert.isDefined(result.createdAt);
				let gather = result.gather;
				assert.equal(gather.gatherers.length, 12);
				assert.equal(gather.state, "done");
				done();
			});
		});
	});

	describe(".recent", () => {
		var gathers;
		beforeEach(done => {
			async.timesSeries(7, (n, next) => {
				ArchivedGather.create({
					gather: generateCompletedGather()
				}, (error, result) => {
					setTimeout(() => {
						next(error, result);
					}, 30);
				});
			}, (error, results) => {
				if (error) return done(error);
				gathers = results;
				done();
			});		
		});
		it ("returns an empty array if no recent gathers", done => {
			helper.clearDb(() => {
				ArchivedGather.recent((error, gathers) => {
					if (error) return done(error);
					assert.isArray(gathers);
					assert.equal(gathers.length, 0);
					done();
				});
			});
		});
		it ("returns 5 most recent gathers", done => {
			let lastFive = gathers.slice(Math.max(gathers.length - 5, 1));
			ArchivedGather.recent((error, results) => {
				if (error) return done(error);
				assert.equal(results.length, 5);
				lastFive.forEach(recent => {
					assert.isTrue(results.some(result => {
						return result.gather.done.time.getTime() 
							=== recent.gather.done.time.getTime();
					}));
				});
				done();
			});
		});
	});
});