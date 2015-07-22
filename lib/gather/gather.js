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
}

Gather.prototype.addGatherer = function (user) {

};

Gather.prototype.removeGatherer = function (user) {

};

Gather.prototype.moveToMarine = function (user) {

};

Gather.prototype.moveToAlien = function (user) {

};

module.exports = Gather;