"use strict";

var fs = require("fs");
var path = require("path");
var extend = require("extend");

var helpers = {}

helpers.server = require(path.join(__dirname, "../../index.js"));

helpers.app = helpers.server.app;

// Models
var User = helpers.User = require(path.join(__dirname, "../../lib/user/user"));
var Gather = helpers.Gather = require(path.join(__dirname, "../../lib/gather/gather"));
var Gatherer = helpers.Gatherer = require(path.join(__dirname, "../../lib/gather/gatherer"));


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
			avatar: "/images/icons/noavatar.png",
			admin: false,
			steam: {
				url: "http://steamcommunity.com/profiles/7656119806792633" + counter,
				nickname: "SteamUser" + counter
			}
		};
		if (o && typeof o === 'object') {
			defaultUser = extend(defaultUser, o);
		}
		return new User(defaultUser);
	}
})()

module.exports = helpers;