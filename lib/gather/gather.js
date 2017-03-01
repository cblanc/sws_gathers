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

const Gatherer = require("./gatherer");
const StateMachine = require("javascript-state-machine");

function Gather (options) {
	if (options === undefined) options = {};
	if (!(this instanceof Gather)) {
		return new Gather(options);
	}
	this.gatherers = [];
	let noop = () => {};
	this.onDone = (typeof options.onDone === 'function') ? 
		options.onDone : noop;
	this.onEvent = (typeof options.onEvent === 'function') ? 
		options.onEvent : noop;
	this.done = {
		time: null
	};
	
	this.teamSize = options.teamSize || 6;

	// Store cooldown times for gather leaves
	this.cooldown = {};
	this.COOLDOWN_TIME = 60 * 3;// 3 Minutes

	this.REGATHER_THRESHOLD = Math.floor(this.teamSize / 2) + 2;

	this.type = options.type || "classic";

	this.name = options.name || "Classic Gather";

	this.description = options.description || "No player requirements";
	
	this.election = {
		INTERVAL: 60000, // 1 Minute
		startTime: null,
		timer: null
	};

	if (typeof options.membershipTest === 'function') {
		this.membershipTest = options.membershipTest.bind(this);
	}

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
		onafterevent: function () {
			this.onEvent.apply(this, [].slice.call(arguments));
		},

		// Gathering State
		onbeforeaddGatherer: function (event, from, to, user) {
			if (this.needsToCoolOff(user)) return false;
			if (this.failsTest(user)) return false;
			this.addUser(user);
			if (!this.lobbyFull()) return false;
		},

		// Election State
		onbeforeselectLeader: function (event, from, to, voter, candidate) {
			this.voteForLeader(voter, candidate);
			if (!this.leaderVotesFull()) return false;
		},

		onenterelection: function () {
			// Setup timer for elections
			this.startElectionCountdown();
		},

		onleaveelection: function () {
			this.cancelElectionCountdown();
		},

		// Selection State 
		onenterselection: function () {
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

		onleaveselection: function (event, from, to, voter, candidate) {
			if (event === "removeGatherer" || event === "regather") {
				this.gatherers.forEach(gatherer => {
					gatherer.team = "lobby";
				});
			}
		},

		onbeforeconfirmSelection: function (event, from, to, leader) {
			return (this.aliens().length === this.teamSize
							&& this.marines().length === this.teamSize);
		},

		// Remove gatherer event
		onbeforeremoveGatherer: function (event, from, to, user) {
			// Cancel transition if no gatherers have been removed
			let userCount = this.gatherers.length;
			this.removeUser(user);
			let userRemoved = userCount > this.gatherers.length;
			if (userRemoved && from !== 'gathering') this.applyCooldown(user);
			return userRemoved;
		},

		// Set gatherer vote & if threshold met, reset gather
		onbeforeregather: function (event, from, to, user, vote) {
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
		onenterdone: function () {
			this.done.time = new Date();
			this.onDone.apply(this, [].slice.call(arguments));
		}
	}
});

Gather.prototype.lobbyFull = function () {
	return this.gatherers.length === (this.teamSize * 2);
};

Gather.prototype.leaderVotesFull = function () {
	return this.leaderVotes().length === (this.teamSize * 2);
};

Gather.prototype.resetState = function () {
	this.gatherers = [];
	this.cancelElectionCountdown();
	return this;
};

Gather.prototype.alienLeader = function () {
	return this.gatherers.reduce((acc, gatherer) => {
		if (gatherer.team === "alien" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.marineLeader = function () {
	return this.gatherers.reduce((acc, gatherer) => {
		if (gatherer.team === "marine" && gatherer.leader) acc.push(gatherer);
		return acc;
	}, []).pop();
};

Gather.prototype.assignMarineLeader = function (id) {
	this.modifyGatherer({id: id}, gatherer => {
		gatherer.leader = true;
		gatherer.team = "marine";
	});
};

Gather.prototype.assignAlienLeader = function (id) {
	this.modifyGatherer({id: id}, gatherer => {
		gatherer.leader = true;
		gatherer.team = "alien";
	});
};

Gather.prototype.containsUser = function (user) {
	return this.gatherers.some(gatherer => {
		return gatherer.id === user.id;
	});
}; 

Gather.prototype.addUser = function (user) {
	if (this.containsUser(user)) return null;
	let gatherer = new Gatherer(user);
	this.gatherers.push(gatherer);
	return gatherer;
};

Gather.prototype.removeUser = function (user) {
	this.gatherers = this.gatherers.filter(gatherer => user.id !== gatherer.id);
};

Gather.prototype.modifyGatherer = function (user, callback){
	return this.gatherers
		.filter(gatherer => gatherer.id === user.id)
		.forEach(callback);
};

// Determines picking order of teams
// Marine 1 pick first
// 2 picks for each team subsequently

Gather.prototype.pickingTurn = function () {
	if (this.current !== 'selection') return null;
	let alienCount = this.aliens().length;
	let marineCount = this.marines().length;
	let total = marineCount + alienCount;
	if (alienCount + marineCount === 2) return "marine";
	if (marineCount > alienCount) return "alien";
	if (marineCount < alienCount) return "marine";
	if (total % 4 === 0) return "alien";
	return "marine";
};

// Moves player to marine
// Optional `mover` argument which will check mover credentials to select
// Credentials: Must be leader, must belong to team, must be turn to pick
Gather.prototype.moveToMarine = function (user, mover) {
	if (this.marines().length >= this.teamSize) return;

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

Gather.prototype.moveToAlien = function (user, mover) {
	if (this.aliens().length >= this.teamSize) return;

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

Gather.prototype.moveToLobby = function (user) {
	this.modifyGatherer(user, gatherer => gatherer.team = "lobby");
};

Gather.prototype.retrieveGroup = function (team) {
	return this.gatherers.filter(gatherer => gatherer.team === team);
};

Gather.prototype.lobby = function () {
	return this.retrieveGroup("lobby");
};

Gather.prototype.aliens = function () {
	return this.retrieveGroup("alien");
};

Gather.prototype.marines = function () {
	return this.retrieveGroup("marine");
};

Gather.prototype.electionStartTime = function () {
	return (this.election.startTime === null) ? 
		null : this.election.startTime.toISOString();
};

Gather.prototype.toJson = function () {
	return {
		name: this.name,
		description: this.description,
		type: this.type,
		gatherers: this.gatherers,
		state: this.current,
		pickingTurn: this.pickingTurn(),
		election: {
			startTime: this.electionStartTime(),
			interval: this.election.INTERVAL
		},
		teamSize: this.teamSize,
		done: {
			time: this.done.time
		},
		cooldown: this.cooldown
	}
};

Gather.prototype.toggleMapVote =  function (voter, mapId) {
	this.modifyGatherer(voter, gatherer => gatherer.toggleMapVote(mapId));
};

Gather.prototype.toggleServerVote = function (voter, serverId) {
	this.modifyGatherer(voter, gatherer => gatherer.toggleServerVote(serverId));
};

// Returns an array of IDs representing votes for leaders
Gather.prototype.leaderVotes = function () {
	let self = this;
	return self.gatherers
		.map(gatherer => gatherer.leaderVote)
		.filter(leaderId => typeof leaderId === 'number')
		.filter(leaderId => self.containsUser({id: leaderId}));
};

Gather.prototype.voteForLeader = function (voter, candidate) {
	this.modifyGatherer(voter, gatherer => gatherer.voteForLeader(candidate));
};

Gather.prototype.getGatherer = function (user) {
	return this.gatherers
		.filter(gatherer => gatherer.id === user.id)
		.pop() || null;
};

Gather.prototype.regatherVotes = function () {
	let self = this;
	return self.gatherers.reduce((acc, gatherer) => {
		if (gatherer.regatherVote) acc++;
		return acc;
	}, 0);
};

// Initiates a timer which will push gather into next state
Gather.prototype.startElectionCountdown = function () {
	let self = this;
	self.election.startTime = new Date();
	this.election.timer = setTimeout(() => {
		if (self.can("electionTimeout")) self.electionTimeout();
	}, self.election.INTERVAL);
};

Gather.prototype.cancelElectionCountdown = function () {
	clearTimeout(this.election.timer);
	this.election.timer = null;
	this.election.startTime = null;
};

Gather.prototype.applyCooldown = function (user) {
	if (user && typeof user.id === 'number') {
		let d = new Date();
		d.setUTCSeconds(d.getUTCSeconds() + this.COOLDOWN_TIME);
		this.cooldown[user.id] = d;
	}
};

Gather.prototype.needsToCoolOff = function (user) {
	if (user && typeof user.id === 'number') {
		let cooldownTime = this.cooldown[user.id];
		if (cooldownTime === undefined) return false;
		return cooldownTime > new Date();
	}
};

Gather.prototype.failsTest = function (user) {
	if (!this.membershipTest) return false;
	return !this.membershipTest(user);
}

module.exports = Gather;
