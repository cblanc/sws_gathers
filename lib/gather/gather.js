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
	this.REGATHER_THRESHOLD = 6;
	this.election = {
		INTERVAL: 120000, // 2 mins
		startTime: null,
		timer: null
	};
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
		},
		{
			name: "regather",
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
			this.startElectionCountdown();
		},

		onleaveelection: () => {
			this.cancelElectionCountdown();
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
			this.assignMarineLeader(parseInt(rank.pop().candidate, 0));
			this.assignAlienLeader(parseInt(rank.pop().candidate, 0));
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

		// Set gatherer vote & if threshold met, reset gather
		onbeforeregather: (event, from, to, user, vote) => {
			let self = this;
			self.modifyGatherer(user, (gatherer) => gatherer.voteRegather(vote));
			if (self.regatherVotes() >= self.REGATHER_THRESHOLD) {
				self.resetState();
				return true;
			} else {
				return false;
			}
		},

		// On enter done
		onenterdone: () => {
			this.onDone.call(this);
		}
	}
});

Gather.prototype.resetState = () => {
	this.gatherers = [];
	return this;
};

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

// Moves player to marine
// Optional `mover` argument which will check mover credentials to select
// Credentials: Must be leader, must belong to team, must be turn to pick
Gather.prototype.moveToMarine = (user, mover) => {
	if (this.marines().length >= this.TEAM_SIZE) return;

	if (mover && this.containsUser(mover)) {
		let leader = this.getGatherer(mover);
		if (leader.team !== "marine" || 
				!leader.leader ||
				this.pickingTurn() !== "marine") return;

		if (user && this.containsUser(user)) {
			if (this.getGatherer(user).team !== "lobby") return;
		}
	}

	this.modifyGatherer(user, gatherer => gatherer.team = "marine");
};

// Moves player to alien
// Optional `mover` argument which will check mover credentials to select
// Credentials: Must be leader, must belong to team, must be turn to pick

Gather.prototype.moveToAlien = (user, mover) => {
	if (this.aliens().length >= this.TEAM_SIZE) return;

	if (mover && this.containsUser(mover)) {
		let leader = this.getGatherer(mover);
		if (leader.team !== "alien" || 
				!leader.leader ||
				this.pickingTurn() !== "alien") return;

		if (user && this.containsUser(user)) {
			if (this.getGatherer(user).team !== "lobby") return;
		}
	}


	return this.modifyGatherer(user, gatherer => gatherer.team = "alien"); 
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

Gather.prototype.electionStartTime = () => {
	return (this.election.startTime === null) ? 
		null : this.election.startTime.toISOString();
};

Gather.prototype.toJson = () => {
	return {
		gatherers: this.gatherers,
		state: this.current,
		pickingTurn: this.pickingTurn(),
		election: {
			startTime: this.electionStartTime(),
			interval: this.election.INTERVAL
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

Gather.prototype.regatherVotes = () => {
	let self = this;
	return self.gatherers.reduce((acc, gatherer) => {
		if (gatherer.regatherVote) acc++;
		return acc;
	}, 0);
};

// Initiates a timer which will push gather into next state
Gather.prototype.startElectionCountdown = () => {
	let self = this;
	self.election.startTime = new Date();
	this.election.timer = setTimeout(() => {
		if (self.can("electionTimeout")) self.electionTimeout();
	}, self.election.INTERVAL);
};

Gather.prototype.cancelElectionCountdown = () => {
	clearInterval(this.election.timer);
	this.election.timer = null;
	this.election.startTime = null;
};

module.exports = Gather;
