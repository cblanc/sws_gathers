"use strict";

/*
 *	Implements Gatherer
 *
 *	Stores necessary information including:
 *	- user data
 *	- voting preferences
 *	- leader status
 *	
 */ 

var User = require("../user/user");

function Gatherer (user) {
	this.votes = {};
	this.id = user.id;
	this.captain = false;
	this.team = "lobby";
}

module.exports = Gatherer;