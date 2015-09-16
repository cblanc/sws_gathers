"use strict";

/*
 *	Implements Gather Model
 *
 *	Gather States
 *	- Gathering
 *	- Election (Electing leaders)
 *	- Selection (Selecting teams)
 *	- Done
 *
 */ 

var Gatherer = require("./gatherer");
var StateMachine = require("javascript-state-machine");

function Gather (options) {
	if (!(this instanceof Gather)) {
		return new Gather(options);
	}
	let noop = () => {};
	this.onDone = (options && typeof options.onDone === 'function') ? 
		options.onDone : noop;
	this.onEvent = (options && typeof options.onEvent === 'function') ? 
		options.onEvent : noop;
	this.TEAM_SIZE = 6;
	this.gatherers = [];
	this.ELECTION_INTERVAL = 300000; // 5 mins
	this.electionStartTime = null;
	this.initState();
}

StateMachine.create({
	target: Gather.prototype,
	events: [
		{ name: "initState", from: "none", to: "gathering" },
		{ name: "addGatherer", from: "gathering", to: "election" },
		{ name: "selectLeader", from: "election", to: "selection" },
		{ name: "electionTimeout", from: "election", to: "selection" },
		{ name: "confirmSelection", from: "selection", to: "done" },
		{ 
			name: "removeGatherer", 
			from: ["gathering", "election", "selection"], 
			to: "gathering" 
		}
	],
	callbacks: {
		// Callbacks for events
		onafterevent: () => {
			this.onEvent.call(this);
		},

		// Gathering State
		onbeforeaddGatherer: (event, from, to, user) => {
			this.addUser(user);
			if (this.gatherers.length !== 12) return false;
		},

		// Election State
		onbeforeselectLeader: (event, from, to, voter, candidate) => {
			this.voteForLeader(voter, candidate);
			if (this.leaderVotes().length !== 12) return false;
		},

		onenterelection: () => {
			// Setup timer for elections
			let self = this;
			self.electionStartTime = new Date();
			setTimeout(() => {
				if (self.can("electionTimeout")) {
					self.electionTimeout();
				}
			}, self.ELECTION_INTERVAL);
		},

		onleaveelection: () => {
			this.electionStartTime = null;
		},

		// Selection State 
		onenterselection: () => {
			// Remove all leaders and teams
			this.gatherers.forEach(gatherer => {
				gatherer.leader = false;
				gatherer.team = "lobby";
			});

			// Assign leaders based on vote
			// 1st place alien comm
			// 2nd place marine comm
			let voteCount = {};
			this.gatherers.forEach(gatherer => { voteCount[gatherer.id] = 0 });
			this.leaderVotes().forEach(candidateId => { voteCount[candidateId]++ });
			let rank = [];
			for (let candidate in voteCount) {
				rank.push({ candidate: candidate, count: voteCount[candidate] });
			}
			rank.sort((a, b) => {
				return a.count - b.count;
			});
			this.assignAlienLeader(parseInt(rank.pop().candidate, 0));
			this.assignMarineLeader(parseInt(rank.pop().candidate, 0));
		},

		onbeforeconfirmSelection: (event, from, to, leader) => {
			return (this.aliens().length === this.TEAM_SIZE
							&& this.marines().length === this.TEAM_SIZE);
		},

		// Remove gatherer event
		onbeforeremoveGatherer: (event, from, to, user) => {
			// Cancel transition if no gatherers have been removed
			let userCount = this.gatherers.length;
			this.removeUser(user);
			return (userCount > this.gatherers.length);
		},

		// On enter done
		onenterdone: () => {
			this.onDone.call(this);
		}
	}
});

Gather.prototype.alienLeader = () => {
	return this.gatherers.reduce((acc, gatherer) => {
		if (gatherer.team === "alien" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.marineLeader = () => {
	return this.gatherers.reduce((acc, gatherer) => {
		if (gatherer.team === "marine" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.assignMarineLeader = id => {
	this.modifyGatherer({id: id}, gatherer => {
		gatherer.leader = true;
		gatherer.team = "marine";
	});
};

Gather.prototype.assignAlienLeader = id => {
	this.modifyGatherer({id: id}, gatherer => {
		gatherer.leader = true;
		gatherer.team = "alien";
	});
};

Gather.prototype.containsUser = user => {
	return this.gatherers.some(gatherer => {
		return gatherer.id === user.id;
	});
}; 

Gather.prototype.addUser = user => {
	if (this.containsUser(user)) return null;
	let gatherer = new Gatherer(user);
	this.gatherers.push(gatherer);
	return gatherer;
};

Gather.prototype.removeUser = user => {
	this.gatherers = this.gatherers.filter(gatherer => user.id !== gatherer.id);
};

Gather.prototype.modifyGatherer = (user, callback) => {
	return this.gatherers
		.filter(gatherer => gatherer.id === user.id)
		.forEach(callback);
};

// Determines picking order of teams
// Marine 1 pick first
// 2 picks for each team subsequently

Gather.prototype.pickingTurn = () => {
	if (this.current !== 'selection') return null;
	let alienCount = this.aliens().length;
	let marineCount = this.marines().length;
	let total = marineCount + alienCount;
	if (alienCount + marineCount === 2) return "marine";
	if (marineCount > alienCount) return "alien";
	if (marineCount < alienCount) return "marine";
	switch (total) {
		case 4:
			return "alien";
		case 6:
			return "marine";
		case 8:
			return "alien";
		case 10:
			return "marine";
	}
};

Gather.prototype.moveToMarine = user => {
	if (this.marines().length >= this.TEAM_SIZE) return;
	this.modifyGatherer(user, gatherer => gatherer.team = "marine");
};

Gather.prototype.moveToAlien = user => {
	if (this.aliens().length >= this.TEAM_SIZE) return;
	this.modifyGatherer(user, gatherer => gatherer.team = "alien");
};

Gather.prototype.moveToLobby = user => {
	this.modifyGatherer(user, gatherer => gatherer.team = "lobby");
};

Gather.prototype.retrieveGroup = team => {
	return this.gatherers.filter(gatherer => gatherer.team === team);
};

Gather.prototype.lobby = () => {
	return this.retrieveGroup("lobby");
};

Gather.prototype.aliens = () => {
	return this.retrieveGroup("alien");
};

Gather.prototype.marines = () => {
	return this.retrieveGroup("marine");
};

Gather.prototype.electionTimer = () => {
	return (this.electionStartTime === null) ? 
		null : this.electionStartTime.toISOString();
};

Gather.prototype.toJson = () => {
	return {
		gatherers: this.gatherers,
		state: this.current,
		election: {
			startTime: this.electionTimer(),
			interval: this.ELECTION_INTERVAL
		}
	}
};

Gather.prototype.voteForMap = (voter, mapId) => {
	this.modifyGatherer(voter, gatherer => gatherer.mapVote = mapId);
};

Gather.prototype.voteForServer = (voter, serverId) => {
	this.modifyGatherer(voter, gatherer => gatherer.serverVote = serverId);
};

// Returns an array of IDs representing votes for leaders
Gather.prototype.leaderVotes = () => {
	let self = this;
	return self.gatherers
		.map(gatherer => gatherer.leaderVote)
		.filter(leaderId => typeof leaderId === 'number')
		.filter(leaderId => self.containsUser({id: leaderId}));
};

Gather.prototype.voteForLeader = (voter, candidate) => {
	this.modifyGatherer(voter, gatherer => gatherer.voteForLeader(candidate));
};

Gather.prototype.getGatherer = (user) => {
	return this.gatherers
		.filter(gatherer => gatherer.id === user.id)
		.pop() || null;
};

module.exports = Gather;
