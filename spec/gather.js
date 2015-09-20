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
				alienLeader = gather.gatherers[1];
				assert.equal(alienLeader.team, "alien");
				marineLeader = gather.gatherers[0];
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
				assert.equal(gather.gatherers[1].team, "alien");
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
				alienLeader = gather.gatherers[1];
				assert.equal(alienLeader.team, "alien");
				marineLeader = gather.gatherers[0];
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
				assert.equal(gather.gatherers[1].team, "alien");
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

	describe("voteForMap", function () {
		beforeEach(function() {
			gather.addGatherer(user);
		});
		it ("assigns map vote to gatherer", function () {
			var mapId = 1;
			gather.voteForMap(user, mapId);
			var gatherer = gather.getGatherer(user);
			assert.equal(gatherer.mapVote, mapId);
		});
	});

	describe("voteForServer", function () {
		beforeEach(function() {
			gather.addGatherer(user);
		});
		it ("assigns map vote to gatherer", function () {
			var serverId = 1;
			gather.voteForServer(user, serverId);
			var gatherer = gather.getGatherer(user);
			assert.equal(gatherer.serverVote, serverId);
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