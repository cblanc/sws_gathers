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
}

Gatherer.prototype.voteForLeader = function (user) {
	this.leaderVote = user.id;
};

module.exports = Gatherer;