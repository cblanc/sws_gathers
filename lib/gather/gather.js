"use strict";

/*
 *	Implements Gather Model
 *
 *	Gather States
 *	- Picking
 *	- Election
 *	- Selection
 *	- Done
 *
 */ 

var Gatherer = require("./gatherer");

function Gather () {
	if (!(this instanceof Gather)) {
		return new Gather();
	}

	this.gatherers = [];
	this.marines = [];
	this.aliens = [];
}

module.exports = Gather;