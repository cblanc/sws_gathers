"use strict";

const helper = require("./helpers/index.js");
const Event = helper.Event;
const Gather = helper.Gather;
const Map = helper.Map;
const maps = Map.list;
const Server = helper.Server;
const servers = Server.list;
const assert = require("chai").assert;
const async = require("async");
const pubsub = helper.eventPubSub;

describe("Event Model", () => {
	before(done => {
		helper.clearDb(done);
	});

	afterEach(done => {
		helper.clearDb(done);
	});

	describe("Event Methods", () => {
		let user;
		beforeEach(() => {
			user = helper.createUser();
		});

		describe(".joiner", () => {
			it ("logs a joiner", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:joiner");
					assert.isTrue(event.public);
					done();
				});
				Event.joiner(user);
			});
		});

		describe(".leaver", () => {
			it ("logs a leaver", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:leaver");
					assert.isTrue(event.public);
					done();
				});
				Event.leaver(user);
			});
		});

		describe(".adminRegather", () => {
			it ("logs an admin reset of the gather", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:reset");
					assert.isTrue(event.public);
					done();
				});
				Event.adminRegather(user);
			});
		});

		describe(".playerSelected", () => {
			let gather, gatherers, marineLeader, alienLeader;
			beforeEach(() => {
				gatherers = [];
				for (var i = 0; i < 12; i++) {
					gatherers.push(helper.createUser());
				}
				gather = Gather();
				helper.populateGatherAndVotes(gather, gatherers);
				marineLeader = gather.marineLeader();
				alienLeader = gather.alienLeader();
			});
			it ("logs a playerSelected event", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:select");
					assert.isTrue(event.public);
					assert.include(event.description, gather.gatherers[2].user.username);
					assert.include(event.description, marineLeader.user.username);
					done();
				});
				gather.moveToMarine(gather.gatherers[2], marineLeader);
				Event.playerSelected(marineLeader.user, {player: gather.gatherers[2].user.id}, gather);
			});
		});

		describe(".leaderVote", () => {
			let gather, gatherers;
			beforeEach(() => {
				gatherers = [];
				gather = Gather();
				for (var i = 0; i < 12; i++) {
					gatherers.push(helper.createUser());
					gather.addGatherer(gatherers[i]);
				}
			});
			it ("logs a leader vote event", done => {
				const voter = gather.gatherers[0];
				const candidate = gather.gatherers[1];
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:vote:leader");
					assert.isTrue(event.public);
					assert.include(event.description, voter.user.username);
					assert.include(event.description, candidate.user.username);
					done();
				});
				Event.leaderVote(voter.user, {
					leader: {
						candidate: candidate.user.id
					}
				}, gather);
			});
		});

		describe(".mapVote", () => {
			let gather, gatherer, map;
			beforeEach(() => {
				gather = Gather();
				gather.addGatherer(user);
				gatherer = gather.gatherers[0];
				map = maps[0];
				gatherer.toggleMapVote(map.id);
			});
			it ("logs a map vote event if map already voted", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:vote:map");
					assert.isTrue(event.public);
					assert.include(event.description, user.username);
					assert.include(event.description, map.name);
					done();
				});
				Event.mapVote(user, {
					map: {
						id: map.id
					}
				}, gather, maps);
			});
		});

		describe(".serverVote", () => {
			let gather, gatherer, server;
			beforeEach(() => {
				gather = Gather();
				gather.addGatherer(user);
				gatherer = gather.gatherers[0];
				server = servers[0];
				gatherer.toggleServerVote(server.id);
			});
			it ("logs a server vote event if server already voted", done => {
				pubsub.once("newEvent", event => {
					assert.equal(event.eventType, "gather:vote:server");
					assert.isTrue(event.public);
					assert.include(event.description, user.username);
					assert.include(event.description, server.description);
					done();
				});
				Event.serverVote(user, {
					server: {
						id: server.id
					}
				}, gather, servers);
			});
		});
	});

	describe(".create", () => {
		it ("creates a new event", done => {
			let event = {
				eventType: "event",
				description: "An event occurred",
				meta: {
					foo: "bar"
				}
			};
			Event.create(event, (error, result) => {
				if (error) return done(error);
				assert.equal(result.eventType, event.eventType);
				assert.equal(result.description, event.description);
				assert.equal(result.description, event.description);
				assert.isDefined(result.createdAt);
				done();
			});
		});
		it ("emits an event when an event is created", done => {
			let event = {
				eventType: "event",
				description: "An event occurred",
				meta: {
					foo: "bar"
				}
			};
			Event.create(event, error => {
				if (error) return done(error);
			});
			pubsub.once("newEvent", newEvent => {
				assert.equal(newEvent.eventType, event.eventType);
				assert.equal(newEvent.description, event.description);
				assert.equal(newEvent.description, event.description);
				assert.isDefined(newEvent.createdAt);
				done();
			});
		});
	});
});