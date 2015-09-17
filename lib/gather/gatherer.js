"use strict";

/*
 *	Implements Gatherer
 *
 *	Stores necessary information including:
 *	- user data
 *	- voting preferences
 *	- leader status
 *	- Team: "lobby" "alien" "marine"
 */ 

var User = require("../user/user");

function Gatherer (user) {
	this.leaderVote = null;
	this.mapVote = null;
	this.serverVote = null;
	this.confirm = false;
	this.id = user.id;
	this.user = user;
	this.leader = false;
	this.team = "lobby"; 
	this.regatherVote = false;
}

Gatherer.prototype.voteForLeader =  candidate => {
	if (candidate === null) {
		return this.leaderVote = null;
	}
	if (typeof candidate === 'number') {
		return this.leaderVote = candidate;
	}
	this.leaderVote = candidate.id;
};

Gatherer.prototype.voteRegather = (vote) => {
	if (vote !== undefined && typeof vote === 'boolean') {
		return this.regatherVote = vote;
	} else {
		this.regatherVote = true;
	}
	return this.regatherVote;
};

module.exports = Gatherer;