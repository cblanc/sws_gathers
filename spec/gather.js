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
		for (var i = 0; i < 12; i++) {
			gatherers.push(helper.createUser());
		}
		gather = Gather();
	});
	
	describe("addUser", function () {
		it ("adds gatherer to lobby", function () {
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
			assert.equal(gather.gatherers[0].id, user.id);
		});
		it ("does not add duplicate users", function () {
			gather.addUser(user);
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
		});
	});

	describe("removeUser", function () {
		it ("removes gatherer altogether", function () {
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
			assert.equal(gather.gatherers[0].id, user.id);
			gather.removeUser(user);
			assert.equal(gather.gatherers.length, 0);
		});
	});

	describe("moveToMarine", function () {
		it ("moves a player to marine", function () {
			gather.addUser(user);
			gather.moveToMarine(user);
			assert.equal(gather.marines().length, 1);
			assert.equal(gather.marines()[0].id, user.id);
		});
		it ("will not move player if team is full", function () {
			gatherers.forEach(function (gatherer, index) {
				gather.addUser(gatherer);
				gather.moveToMarine(gatherer);
				assert.isTrue(gather.marines().length <= gather.TEAM_SIZE);
			});
		});
		describe("with mover argument", function () {
			var marineCount, gathererCursor, alienLeader, marineLeader;
			beforeEach(function () {
				helper.populateGatherAndVotes(gather, gatherers);
				alienLeader = gather.gatherers[0];
				assert.equal(alienLeader.team, "alien");
				marineLeader = gather.gatherers[1];
				assert.equal(marineLeader.team, "marine");
				gathererCursor = 2;
				marineCount = gather.marines().length;
			});
			it ("moves player if mover is captain & is marine & current turn", function () {
				gather.moveToMarine(gather.gatherers[gathererCursor], marineLeader);
				assert.equal(gather.marines().length, marineCount + 1);
				assert.equal(gather.gatherers[gathererCursor].team, "marine");
			});
			it ("does not move player if mover is not in team", function () {
				gather.moveToMarine(gather.gatherers[gathererCursor], alienLeader);
				assert.equal(gather.marines().length, marineCount);
				assert.equal(gather.gatherers[gathererCursor].team, "lobby");
			});
			it ("does not move player if not captain", function () {
				gather.moveToMarine(gather.gatherers[gathererCursor], marineLeader);
				assert.equal(gather.gatherers[gathererCursor].team, "marine");
				gather.moveToAlien(gather.gatherers[gathererCursor + 1], alienLeader);
				gather.moveToAlien(gather.gatherers[gathererCursor + 2], alienLeader);
				assert.equal(gather.marines().length, 2);
				assert.equal(gather.aliens().length, 3);
				gather.moveToMarine(gather.gatherers[gathererCursor + 3], 
						gather.gatherers[gathererCursor]);
				assert.equal(gather.marines().length, marineCount + 1);
				assert.equal(gather.gatherers[gathererCursor + 3].team, "lobby");
			});
			it ("does not move player if already assigned to team", function () {
				gather.moveToMarine(alienLeader, marineLeader);
				assert.equal(gather.gatherers[0].team, "alien");
			});
		});
	});

	describe("moveToAlien", function () {
		it ("moves a player to alien", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
			assert.equal(gather.aliens()[0].id, user.id);
		});
		it ("will not move player if team is full", function () {
			gatherers.forEach(function (gatherer, index) {
				gather.addUser(gatherer);
				gather.moveToAlien(gatherer);
				assert.isTrue(gather.aliens().length <= gather.TEAM_SIZE);
			});
		});
		describe("with mover argument", function () {
			var alienCount, gathererCursor, alienLeader, marineLeader;
			beforeEach(function () {
				helper.populateGatherAndVotes(gather, gatherers);
				gather.moveToMarine(gather.gatherers[2]);
				alienLeader = gather.gatherers[0];
				assert.equal(alienLeader.team, "alien");
				marineLeader = gather.gatherers[1];
				assert.equal(marineLeader.team, "marine");
				gathererCursor = 3;
				alienCount = gather.aliens().length;
			});
			it ("moves player if mover is captain & is alien & current turn", function () {
				gather.moveToAlien(gather.gatherers[gathererCursor], alienLeader);
				assert.equal(gather.aliens().length, alienCount + 1);
				assert.equal(gather.gatherers[gathererCursor].team, "alien");
			});
			it ("does not move player if mover is not in team", function () {
				gather.moveToAlien(gather.gatherers[gathererCursor], marineLeader);
				assert.equal(gather.aliens().length, alienCount);
				assert.equal(gather.gatherers[gathererCursor].team, "lobby");
			});
			it ("does not move player if not captain", function () {
				gather.moveToAlien(gather.gatherers[gathererCursor], alienLeader);
				assert.equal(gather.gatherers[gathererCursor].team, "alien");
				alienCount++;
				gather.moveToAlien(gather.gatherers[gathererCursor + 1], 
						gather.gatherers[gathererCursor]);
				assert.equal(gather.aliens().length, alienCount);
				assert.equal(gather.gatherers[gathererCursor + 1].team, "lobby");
			});
			it ("does not move player if already assigned to team", function () {
				gather.moveToMarine(alienLeader, marineLeader);
				assert.equal(gather.gatherers[0].team, "alien");
			});
		});
	});

	describe("pickingTurn", function () {
		var marineLeader, alienLeader;
		beforeEach(function () {
			helper.populateGatherAndVotes(gather, gatherers);
			marineLeader = gather.marineLeader();
			alienLeader = gather.alienLeader();
			assert.isNotNull(marineLeader);
			assert.isNotNull(alienLeader);
			assert.equal(gather.current, "selection");
		});
		it ("returns null if current state is not selection", function () {
			gather = Gather();
			assert.isNull(gather.pickingTurn());
		});
		it ("gives first pick to aliens, then 2 for each side after", function () {
			var gathererCursor = 2; // Picking i=2 gatherer next
			var assertMarineNextMove = function () {
				assert.equal(gather.pickingTurn(), "marine");
				gather.moveToMarine(gather.gatherers[gathererCursor], marineLeader);
				gathererCursor++;
			};
			var assertAlienNextMove = function () {
				assert.equal(gather.pickingTurn(), "alien");
				gather.moveToAlien(gather.gatherers[gathererCursor], alienLeader);	
				gathererCursor++;
			};
			assertMarineNextMove();
			assertAlienNextMove();
			assertAlienNextMove();
			assertMarineNextMove();
			assertMarineNextMove();
			assertAlienNextMove();
			assertAlienNextMove();
			assertMarineNextMove();
			assertMarineNextMove();
			assertAlienNextMove();
		});
	});

	describe("moveToLobby", function () {
		it ("moves a player to lobby", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
			gather.moveToLobby(user);
			assert.equal(gather.lobby().length, 1);
			assert.equal(gather.lobby()[0].id, user.id);
		});
	});

	describe("aliens", function () {
		it ("returns all gatherers in aliens", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
		});
	});

	describe("marines", function () {
		it ("returns all gatherers in marines", function () {
			gather.addUser(user);
			gather.moveToMarine(user);
			assert.equal(gather.marines().length, 1);
		});
	});

	describe("lobby", function () {
		it ("returns all gatherers in lobby", function () {
			gather.addUser(user);
			assert.equal(gather.lobby().length, 1);
		});
	});

	describe("toJson", function () {
		it ("returns a json representation of the gather instance", function () {
			var output = gather.toJson();
			assert.isArray(output.gatherers);
			assert.isString(output.state);
			assert.isNull(output.election.startTime);
			assert.isObject(output.cooldown);
			assert.equal(output.election.interval, gather.election.INTERVAL);
		});
	});

	describe("leaderVotes", function () {
		beforeEach(function () {
			gatherers.forEach(function (user) {
				gather.addUser(user);
			});
		});
		it ("initialises with an empty array", function () {
			assert.isArray(gather.leaderVotes());
			assert.equal(gather.leaderVotes(), 0);
		});
		it ("returns an array of user ids", function () {
			var candidate = gatherers[0];
			var voter = gatherers[1];
			gather.voteForLeader(voter, candidate);
			assert.isArray(gather.leaderVotes());
			assert.equal(gather.leaderVotes().length, 1);
			assert.equal(gather.leaderVotes()[0], candidate.id);
		});
		it ("ignores candidates who have left the gather", function () {
			var candidate = gatherers[0];
			var voter = gatherers[1];
			gather.voteForLeader(voter, candidate);
			gather.removeUser(candidate);
			assert.equal(gather.leaderVotes().length, 0);
		});
	});

	describe("voteForLeader", function () {
		beforeEach(function () {
			gatherers.forEach(function (user) {
				gather.addUser(user);
			});
		});
		it ("assigns vote for a leader", function () {
			var candidate = gatherers[0];
			var voter = gatherers[1];
			gather.voteForLeader(voter, candidate);
			var votes = gather.leaderVotes();
			assert.equal(votes.length, 1);
			assert.equal(votes[0], candidate.id);
		});
		it ("reassigns vote if already voted", function () {
			var candidate = gatherers[0];
			var secondCandidate = gatherers[2];
			var voter = gatherers[1];
			gather.voteForLeader(voter, candidate);
			var votes = gather.leaderVotes();
			assert.equal(votes.length, 1);
			assert.equal(votes[0], candidate.id);
			gather.voteForLeader(voter, secondCandidate);
			votes = gather.leaderVotes();
			assert.equal(votes.length, 1);
			assert.equal(votes[0], secondCandidate.id);
		});
	});

	describe("alienLeader", function () {
		beforeEach(function () {
			gatherers.forEach(function (gatherer) {
				gather.addGatherer(gatherer);
			});
		});
		it ("returns alien leader", function () {
			gather.gatherers[0].team = "alien";
			gather.gatherers[0].leader = true;
			assert.equal(gather.alienLeader().id, gather.gatherers[0].id);
		});
		it ("returns undefined if no alien leader", function () {
			assert.isUndefined(gather.alienLeader());
		});
	});

	describe("marineLeader", function () {
		beforeEach(function () {
			gatherers.forEach(function (gatherer) {
				gather.addGatherer(gatherer);
			});
		});
		it ("returns marine leader", function () {
			gather.gatherers[0].team = "marine";
			gather.gatherers[0].leader = true;
			assert.equal(gather.marineLeader().id, gather.gatherers[0].id);
		});
		it ("returns undefined if no marine leader", function () {
			assert.isUndefined(gather.marineLeader());
		});
	});

	describe("assignMarineLeader", function () {
		it ("assigns a marine leader", function () {
			gather.addUser(user);
			gather.assignMarineLeader(user.id);
			var leader = gather.marineLeader();
			assert.equal(leader.id, user.id);
		});
	});

	describe("assignAlienLeader", function () {
		it ("assigns an alien leader", function () {
			gather.addUser(user);
			gather.assignAlienLeader(user.id);
			var leader = gather.alienLeader();
			assert.equal(leader.id, user.id);
		});
	});

	describe("modifyGatherer", function () {
		beforeEach(function () {
			gather.addGatherer(user);
		});	
		it ("modifies a gatherer", function () {
			assert.isFalse(gather.gatherers[0].confirm);
			gather.modifyGatherer(user, gatherer => {
				gatherer.confirm = true;
			});
			let g = gather.getGatherer(user);
			assert.isTrue(g.confirm);
		});
	});

	describe("getGatherer", function () {
		beforeEach(function () {
			gather.addGatherer(user);
		});
		it ("returns a gatherer given a user", function () {
			var gatherer = gather.getGatherer(user);
			assert.equal(gatherer.id, user.id);
		});
		it ("returns null if user is not a gatherer", function () {
			var gatherer = gather.getGatherer(gatherers[0]);
			assert.isNull(gatherer);
		});
	});

	describe("toggleMapVote", function () {
		beforeEach(function() {
			gather.addGatherer(user);
		});
		it ("assigns map vote to gatherer", function () {
			var mapId = 1;
			gather.toggleMapVote(user, mapId);
			var gatherer = gather.getGatherer(user);
			assert.equal(gatherer.mapVote, mapId);
		});
	});

	describe("toggleServerVote", function () {
		beforeEach(function() {
			gather.addGatherer(user);
		});
		it ("assigns map vote to gatherer", function () {
			var serverId = 1;
			gather.toggleServerVote(user, serverId);
			var gatherer = gather.getGatherer(user);
			assert.equal(gatherer.serverVote, serverId);
		});
	});

	describe("applyCooldown", function () {
		it ("applies a cooldown to the gatherer", function () {
			gather.applyCooldown(user);
			assert.isDefined(gather.cooldown[user.id]);
		});
	});

	describe("needsToCoolOff", function () {
		it ("returns false if gatherer is new", function () {
			assert.isFalse(gather.needsToCoolOff(user));
		});
		it ("returns false if gatherer has cooled off", function () {
			gather.applyCooldown(user);
			gather.cooldown[user.id] = new Date(0);
			assert.isFalse(gather.needsToCoolOff(user));
		});
		it ("returns true if gatherer needs to cool off", function () {
			gather.applyCooldown(user);
			assert.isTrue(gather.needsToCoolOff(user));
		});
	});

	describe("regatherVotes", function () {
		beforeEach(function() {
			gather.addGatherer(user);
		});
		it ("counts the number of regather votes", function () {
			assert.equal(gather.regatherVotes(), 0);
			gather.gatherers[0].regatherVote = true;
			assert.equal(gather.regatherVotes(), 1);
		});
	});
});