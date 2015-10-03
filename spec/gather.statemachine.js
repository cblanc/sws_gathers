"use strict";

var helper = require("./helpers/index.js");
var User = helper.User;
var Gather = helper.Gather;
var Gatherer = helper.Gatherer;
var assert = require("chai").assert;

describe("Gather Model:", function () {
	var user, gather, gatherers;

	beforeEach(function () {
		user = helper.createUser();
		gatherers = [];
		for (var i = 0; i < 12; i++)
		gatherers.push(helper.createUser());
		gather = Gather();
	});

	describe("Internal State", function () {

		describe("Gathering", function () {
			it ("has initial state of 'gathering'", function () {
				assert.equal(gather.current, 'gathering');
			});
			describe("#addGatherer", function () {
				it ("adds users to the gather", function () {
					gather.addGatherer(user);
					assert.equal(gather.current, 'gathering');
					assert.equal(gather.gatherers.length, 1);
				});
				it ("doesn't add a player still on cooldown", function () {
					gather.applyCooldown(user);
					gather.addGatherer(user);
					assert.isFalse(gather.gatherers.some(gatherer => user.id === gatherer.id));
				});
				it ("retains 'gathering' state until number of players is 12", function () {
					assert.equal(gather.gatherers.length, 0);
					gatherers.forEach(function (user, index, array) {
						gather.addGatherer(user);
						if (index === 11) {
							assert.equal(gather.current, 'election');
						} else {
							assert.equal(gather.current, 'gathering');
						}
					});
				});
			});
			describe("#removeGatherer", function () {
				it ("removes gatherer", function () {
					gather.addGatherer(user);
					assert.isTrue(gather.gatherers.some(gatherer => user.id === gatherer.id));
					gather.removeGatherer(user);
					assert.isFalse(gather.gatherers.some(gatherer => user.id === gatherer.id));
				});
				it ("does not apply a cooldown", function () {
					gather.addGatherer(user);
					gather.removeGatherer(user);
					assert.isUndefined(gather.cooldown[user.id]);
				});
			})
		});
		it ("removes all gatherers when regathererd", function () {
			gatherers.forEach((user, index) => {
				if (index < 11) gather.addGatherer(user);
			});
			for (let i = 0; i < gather.REGATHER_THRESHOLD - 1; i++) {
				gather.regather(gather.gatherers[i]);
				assert.equal(gather.regatherVotes(), i + 1);
				assert.equal(gather.current, 'gathering');
			}
			gather.regather(gatherers[gather.REGATHER_THRESHOLD]);
			assert.equal(gather.gatherers.length, 0);
			assert.equal(gather.regatherVotes(), 0);
			assert.equal(gather.current, 'gathering');
		});
		describe("Election Timeout", function () {
			it ("starts a timer and transitions to next state when timer runs out", function (done) {
				gather = new Gather({
					onEvent: function () {
						if (gather.current === "selection") {
							assert.isNull(gather.election.startTime);
							done();
						}
					}
				});
				gather.election.INTERVAL = 100; // 10ms
				assert.isNull(gather.election.startTime);
				assert.isNull(gather.election.timer);
				gatherers.forEach(function (gatherer) {
					gather.addGatherer(gatherer);
				});	
				assert.equal(gather.current, "election");
				assert.isNotNull(gather.election.startTime);
			});
		});

		describe("Election", function () {
			beforeEach(function () {
				gatherers.forEach(function (gatherer) {
					gather.addGatherer(gatherer);
				});
			});
			describe("selectLeader", function () {
				it ("adds vote for a leader", function () {
					var voter = gather.gatherers[helper.random(12)];
					var candidate = gather.gatherers[helper.random(12)];
					gather.selectLeader(voter, candidate);
					assert.equal(gather.current, "election");
					assert.equal(gather.leaderVotes().length, 1);
					assert.equal(gather.leaderVotes()[0], candidate.id);
				});
				
				it ("retains state of 'election' until all votes cast", function () {
					var candidate = gatherers[0];
					gatherers.forEach(function (voter, index) {
						gather.selectLeader(voter, candidate);
						if (index !== 11) {
							assert.equal(gather.current, 'election');
						} else {
							assert.equal(gather.current, 'selection');
						}
					});
				});
				it ("produces leaders based on votes on transition", function () {
					var candidateA = gatherers[0];
					var candidateB = gatherers[1];
					assert.isUndefined(gather.alienLeader());
					assert.isUndefined(gather.marineLeader());
					gatherers.forEach(function (voter, index) {
						if (index % 2 === 0) {
							gather.selectLeader(voter, candidateA);
						} else {
							gather.selectLeader(voter, candidateB);
						}
					});
					assert.equal(gather.current, 'selection');
					assert.isTrue(gather.alienLeader().id === candidateA.id 
													|| gather.alienLeader().id === candidateB.id);
					assert.isTrue(gather.marineLeader().id === candidateA.id 
													|| gather.marineLeader().id === candidateB.id);
				});
				it ("transitions to gathering and removes all gatherers on regather", function () {
					for (let i = 0; i < gather.REGATHER_THRESHOLD - 1; i++) {
						gather.regather(gather.gatherers[i]);
						assert.equal(gather.regatherVotes(), i + 1);
						assert.equal(gather.current, 'election');
					}
					gather.regather(gather.gatherers[gather.REGATHER_THRESHOLD]);
					assert.equal(gather.gatherers.length, 0);
					assert.equal(gather.regatherVotes(), 0);
					assert.equal(gather.current, 'gathering');
				});
				it ("returns to 'gathering' state if player leaves", function () {
					assert.equal(gather.current, 'election');
					var voter = gather.gatherers[helper.random(12)];
					var candidate = gather.gatherers[helper.random(12)];
					gather.selectLeader(voter, candidate);
					gather.removeGatherer(voter);
					assert.isDefined(gather.cooldown[voter.id]);
					assert.equal(gather.current, 'gathering');
				});
			});
		});

		describe("Selection", function () {
			var leaderA, leaderB;
			beforeEach(function () {
				gatherers.forEach(function (gatherer) {
					gather.addGatherer(gatherer);
				});
				leaderA = gatherers[0];
				leaderB = gatherers[1];
				gatherers.forEach(function (voter, index) {
					if (index % 2 === 0) {
						gather.selectLeader(voter, leaderA);
					} else {
						gather.selectLeader(voter, leaderB);
					}
				});

				gatherers.forEach(function (gatherer, index) {
					if (gatherer.leader) return;
					if (index % 2 === 0) {
						gather.moveToAlien(gatherer);
					} else {
						gather.moveToMarine(gatherer);
					}
				});
			});
			it ("transitions to 'done' when players selected", function () {
				gather.confirmSelection();
				assert.equal(gather.current, "done");
			});
			it ("does not transition to 'done' unless all players selected", function () {
				var lobbyPlayer = gather.gatherers[11];
				gather.moveToLobby(lobbyPlayer);
				assert.equal(gather.current, "selection");
			});
			it ("transitions to picking if a player leaves", function () {
				var leaver = gather.gatherers[11];
				assert.equal(gather.current, "selection");
				gather.removeGatherer(leaver);
				assert.equal(gather.current, "gathering");
				assert.isDefined(gather.cooldown[leaver.id]);
			});
			it ("transitions to gathering and removes all gatherers on regather", function () {
				for (let i = 0; i < gather.REGATHER_THRESHOLD - 1; i++) {
					gather.regather(gather.gatherers[i]);
					assert.equal(gather.regatherVotes(), i + 1);
					assert.equal(gather.current, 'selection');
				}
				gather.regather(gather.gatherers[gather.REGATHER_THRESHOLD]);
				assert.equal(gather.gatherers.length, 0);
				assert.equal(gather.regatherVotes(), 0);
				assert.equal(gather.current, 'gathering');
			});
		});
	});
});