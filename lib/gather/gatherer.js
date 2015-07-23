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
	this.votes = {};
	this.id = user.id;
	this.user = user;
	this.captain = false;
	this.team = "lobby"; 
}

module.exports = Gatherer;