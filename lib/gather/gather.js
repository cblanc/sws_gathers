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

function Gather () {
	if (!(this instanceof Gather)) {
		return new Gather();
	}
	this.TEAM_SIZE = 6;
	this.gatherers = [];
	this.initState();
}

Gather.prototype.confirmTeam = function (user) {
	this.modifyGatherer(user, function (gatherer) {
		if (!gatherer.leader) return gatherer
		gatherer.confirm = true;
		return gatherer;
	});
};

Gather.prototype.alienLeader = function () {
	return this.gatherers.reduce(function (acc, gatherer) {
		if (gatherer.team === "alien" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.marineLeader = function () {
	return this.gatherers.reduce(function (acc, gatherer) {
		if (gatherer.team === "marine" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.assignMarineLeader = function (id) {
	this.modifyGatherer({id: id}, function (gatherer) {
		gatherer.leader = true;
		gatherer.team = "marine";
		return gatherer;
	});
};

Gather.prototype.assignAlienLeader = function (id) {
	this.modifyGatherer({id: id}, function (gatherer) {
		gatherer.leader = true;
		gatherer.team = "alien";
		return gatherer;
	});
};

Gather.prototype.containsUser = function (user) {
	return this.gatherers.some(function (gatherer) {
		return gatherer.id === user.id;
	});
}; 

Gather.prototype.addUser = function (user) {
	if (this.containsUser(user)) {
		return null;
	}
	var gatherer = new Gatherer(user);
	this.gatherers.push(gatherer);
	return gatherer;
};

Gather.prototype.removeUser = function (user) {
	this.gatherers = this.gatherers.filter(function (gatherer) {
		return user.id !== gatherer.id;
	});
};

Gather.prototype.modifyGatherer = function (user, callback) {
	this.gatherers.forEach(function (gatherer, index, array) {
		if (gatherer.id === user.id) {
			var modifiedUser = callback(gatherer);
			array[index] = modifiedUser;
		}
	});
}

Gather.prototype.moveToMarine = function (user) {
	if (this.marines().length >= this.TEAM_SIZE) return;
	this.modifyGatherer(user, function (gatherer) {
		gatherer.team = "marine";
		return gatherer;
	});
};

Gather.prototype.moveToAlien = function (user) {
	if (this.aliens().length >= this.TEAM_SIZE) return;
	this.modifyGatherer(user, function (gatherer) {
		gatherer.team = "alien";
		return gatherer;
	});
};

Gather.prototype.moveToLobby = function (user) {
	this.gatherers.forEach(function (gatherer, index, array) {
		if (gatherer.id === user.id) {
			gatherer.team = "lobby";
			array[index] = gatherer;
		}
	});
};

Gather.prototype.retrieveGroup = function (team) {
	return this.gatherers.filter(function (gatherer) {
		return gatherer.team === team;
	});
}

Gather.prototype.lobby = function () {
	return this.retrieveGroup("lobby");
};

Gather.prototype.aliens = function () {
	return this.retrieveGroup("alien");
};

Gather.prototype.marines = function () {
	return this.retrieveGroup("marine");
};

Gather.prototype.toJson = function () {
	return {
		gatherers: this.gatherers,
		state: this.current
	}
};

// Returns an array of IDs representing votes for leaders
Gather.prototype.leaderVotes = function () {
	var self = this;
	return self.gatherers.map(function (gatherer) {
		return gatherer.leaderVote
	}).filter(function (leaderId) {
		return (typeof leaderId === 'number');
	}).filter(function (candidate) {
		return self.gatherers.some(function (gatherer) {
			return gatherer.id === candidate;
		});
	});
};

Gather.prototype.voteForLeader = function (voter, candidate) {
	this.gatherers.forEach(function (gatherer, index, array) {
		if (gatherer.id === voter.id) {
			array[index].voteForLeader(candidate);
		}
	});
};

// Gather States
// - Gathering
// - Election
// - Selection
// - Done

// gather.current - contains the current state
// gather.is(s) - return true if state s is the current state
// gather.can(e) - return true if event e can be fired in the current state
// gather.cannot(e) - return true if event e cannot be fired in the current state
// gather.transitions() - return list of events that are allowed from the current state

StateMachine.create({
	target: Gather.prototype,
	events: [
		{ name: "initState", from: "none", to: "gathering" },
		{ name: "addGatherer", from: "gathering", to: "election" },
		{ name: "selectLeader", from: "election", to: "selection" },
		{ name: "confirmSelection", from: "selection", to: "done" },
		{ name: "removeGatherer", from: ["gathering", "election", "selection"], to: "gathering" }
	],
	callbacks: {
		onbeforeaddGatherer: function (event, from, to, user) {
			this.addUser(user);
			if (this.gatherers.length !== 12) {
				return false;
			}
		},
		onbeforeselectLeader: function (event, from, to, voter, candidate) {
			this.voteForLeader(voter, candidate);
			if (this.leaderVotes().length !== 12) {
				return false;
			}
		},
		onbeforeremoveGatherer: function (event, from, to, user) {
			this.removeUser(user);
		},
		onenterselection: function () {
			// Remove all leaders and teams
			this.gatherers.forEach(function (gatherer, index, array) {
				array[index].leader = false;
				array[index].confirm = false;
				array[index].team = "lobby";
			});

			// Assign leaders based on vote
			// 1st place alien comm
			// 2nd place marine comm
			var voteCount = {};
			this.gatherers.forEach(function (gatherer) {
				voteCount[gatherer.id] = 0;
			});
			this.leaderVotes().forEach(function (candidateId) {
				voteCount[candidateId]++;
			});
			var rank = [];
			for (var candidate in voteCount) {
				rank.push({ candidate: candidate, count: voteCount[candidate] });
			}
			rank.sort(function (a, b) {
				return a.count - b.count;
			});
			this.assignAlienLeader(parseInt(rank.pop().candidate, 0));
			this.assignMarineLeader(parseInt(rank.pop().candidate, 0));
		},
		onbeforeconfirmSelection: function (event, from, to, leader) {
			this.confirmTeam(leader);
			return (this.marineLeader().confirm 
							&& this.alienLeader().confirm
							&& this.aliens().length === this.TEAM_SIZE
							&& this.marines().length === this.TEAM_SIZE);
		}
	}
});

module.exports = Gather;
