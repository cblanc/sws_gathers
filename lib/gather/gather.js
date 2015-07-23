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

Gather.prototype.moveToMarine = function (user) {
	this.gatherers.forEach(function (gatherer, index, array) {
		if (gatherer.id === user.id) {
			gatherer.team = "marine";
			array[index] = gatherer;
		}
	});
};

Gather.prototype.moveToAlien = function (user) {
	this.gatherers.forEach(function (gatherer, index, array) {
		if (gatherer.id === user.id) {
			gatherer.team = "alien";
			array[index] = gatherer;
		}
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
		lobby: this.lobby(),
		marines: this.marines(),
		aliens: this.aliens()
	}
}

module.exports = Gather;