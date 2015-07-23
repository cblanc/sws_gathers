"use strict";

var helper = require("./helpers/index.js");
var User = helper.User;
var Gather = helper.Gather;
var Gatherer = helper.Gatherer;
var assert = require("chai").assert;

describe("Gather model", function () {
	var user, gather;
	beforeEach(function () {
		user = helper.createUser();
		gather = Gather();
	});
	describe("addUser", function () {
		it ("adds gatherer to lobby", function () {
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
			assert.equal(gather.gatherers[0].id, user.id);
		});
		it ("does not add duplicate users", function () {
			gather.addUser(user);
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
		});
	});
	describe("removeUser", function () {
		it ("removes gatherer altogether", function () {
			gather.addUser(user);
			assert.equal(gather.gatherers.length, 1);
			assert.equal(gather.gatherers[0].id, user.id);
			gather.removeUser(user);
			assert.equal(gather.gatherers.length, 0);
		});
	});
	describe("moveToMarine", function () {
		it ("moves a player to marine", function () {
			gather.addUser(user);
			gather.moveToMarine(user);
			assert.equal(gather.marines().length, 1);
			assert.equal(gather.marines()[0].id, user.id);
		});
	});
	describe("moveToAlien", function () {
		it ("moves a player to alien", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
			assert.equal(gather.aliens()[0].id, user.id);
		});
	});
	describe("moveToLobby", function () {
		it ("moves a player to lobby", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
			gather.moveToLobby(user);
			assert.equal(gather.lobby().length, 1);
			assert.equal(gather.lobby()[0].id, user.id);
		});
	});
	describe("aliens", function () {
		it ("returns all gatherers in aliens", function () {
			gather.addUser(user);
			gather.moveToAlien(user);
			assert.equal(gather.aliens().length, 1);
		});
	});
	describe("marines", function () {
		it ("returns all gatherers in marines", function () {
			gather.addUser(user);
			gather.moveToMarine(user);
			assert.equal(gather.marines().length, 1);
		});
	});
	describe("lobby", function () {
		it ("returns all gatherers in lobby", function () {
			gather.addUser(user);
			assert.equal(gather.lobby().length, 1);
		});
	});
	describe("toJson", function () {
		it ("returns a json representation of the gather instance");
	});
});