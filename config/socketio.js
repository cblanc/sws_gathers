"use strict";

var winston = require("winston");
var User = require("../lib/user/user");
var config = require("./config");
var EnslClient = require("../lib/ensl/client");
var chatController = require("../lib/chat/controller");
var gatherController = require("../lib/gather/controller");
var userController = require("../lib/user/controller");
var eventController = require("../lib/event/controller");
var usersHelper = require("../lib/user/helper");
var env = process.env.NODE_ENV || "development";
var parseCookies = EnslClient.parseCookies;

var assignRandomUser = (socket, next) => {
	usersHelper.getRandomUser(function (error, user) {
		if (error) {
			winston.error(error);
			return next(new Error("Authentication Failed"))
		}
		socket._user = user;
		return next();
	});
};

var handleFailedAuth = (socket, next) => {
	if (process.env.RANDOM_USER) {
		return assignRandomUser(socket, next);
	} else {
		return next(new Error("Authentication Failed"));
	}
};

module.exports = io => {
	var rootNamespace = io.of('/')

	// Authentication
	io.use((socket, next) => {
		let cookies = parseCookies(socket);

		if (!cookies) {
			return handleFailedAuth(socket, next);
		}

		let session = cookies[config.session_store_name];

		if (!session) {
			return handleFailedAuth(socket, next);	
		}

		EnslClient.decodeSession(session, function (error, userId) {
			if (error) return handleFailedAuth(socket, next);
			User.find(userId, (error, user) => {
				if (error) {
					winston.error(error);
					return next(new Error("Authentication failed"));
				}
				socket._user = user;
				if (socket._user.bans.gather) return next(new Error("Gather Banned"));
				winston.info("Logged in:", user.username, user.id);
				return next();
			});
		});
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
	eventController(rootNamespace);
};
