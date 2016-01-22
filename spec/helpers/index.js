"use strict";

const fs = require("fs");
const path = require("path");
const extend = require("extend");

const winston = require("winston");
winston.remove(winston.transports.Console);

var helpers = {}

const Map = helpers.Map = require(path.join(__dirname, "../../lib/gather/map.js"));
const Server = helpers.Server = require(path.join(__dirname, "../../lib/gather/server.js"));

helpers.server = require(path.join(__dirname, "../../index.js"));

helpers.app = helpers.server.app;

// Models
const User = helpers.User = require(path.join(__dirname, "../../lib/user/user"));
const Gather = helpers.Gather = require(path.join(__dirname, "../../lib/gather/gather"));
const Gatherer = helpers.Gatherer = require(path.join(__dirname, "../../lib/gather/gatherer"));

// ENSL Client
const EnslClient = helpers.EnslClient = require(path.join(__dirname, "../../lib/ensl/client"));
const HiveClient = helpers.HiveClient = require(path.join(__dirname, "../../lib/hive/client"));

// Mongo & Associated Models
const db = require(path.join(__dirname, "../../db/index"));
const mongoose = require("mongoose");
const Message = helpers.Message = mongoose.model("Message");
const Session = helpers.Session = mongoose.model("Session");
const Profile = helpers.Profile = mongoose.model("Profile");
const Event = helpers.Event = mongoose.model("Event");
const ArchivedGather = helpers.ArchivedGather = mongoose.model("ArchivedGather");

// Pubsub
const eventPubSub = helpers.eventPubSub = require(path.join(__dirname, "../../lib/event/pubsub.js"));

var async = require("async");
helpers.clearDb = function (callback) {
	async.series([
		function (cb) {
			Message.remove({}, cb)
		},
		function (cb) {
			Session.remove({}, cb)
		},
		function (cb) {
			Profile.remove({}, cb)
		},
		function (cb) {
			ArchivedGather.remove({}, cb)
		}
	], callback);
}

// Create User Method 
// Each user will have unique ID, username and steam attributes
var createUser = helpers.createUser = (function () {
	var counter = 0;
	return function (o) {
		counter++
		var defaultUser = {
			id: counter,
			username: "User" + counter,
			country: "CA",
			time_zone: "Eastern Time (US & Canada)",
			avatar: "/icons/noavatar.png",
			admin: false,
			steam: {
				url: "http://steamcommunity.com/profiles/7656119806792633" + counter,
				nickname: "SteamUser" + counter
			}
		};
		if (o && typeof o === "object") {
			defaultUser = extend(defaultUser, o);
		}
		return new User(defaultUser);
	}
})()

var random = helpers.random = function (n) {
	return Math.floor(Math.random () * n);
}

helpers.createMessage = function (options, callback) {
	var content = options.content || "Test content";
	var user = options.user || createUser();
	Message.create({
		author: {
			username: user.username,
			avatar: user.avatar
		},
		content: content
	}, callback);
};

helpers.populateGatherAndVotes = function (gather, gatherers) {
	gatherers.forEach(function (gatherer, index) {
		gather.addGatherer(gatherer);
	});
	gatherers.forEach(function (gatherer, index) {
		let candidate = gather.gatherers[index % 2];
		gather.selectLeader(gatherer, candidate);
	});
};

module.exports = helpers;