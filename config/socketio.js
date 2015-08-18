"use strict";

var winston = require("winston");
var User = require("../lib/user/user");
var config = require("./config");
var EnslClient = require("../lib/ensl/client");
var client = EnslClient();
var chatController = require("../lib/chat/controller");
var gatherController = require("../lib/gather/controller");
var userController = require("../lib/user/controller");
var usersHelper = require("../lib/user/helper");
var env = process.env.NODE_ENV || "development";

var parseCookies = EnslClient.parseCookies;

var assignRandomUser = (socket, next) => {
	usersHelper.getRandomUser(function (error, _, body) {
		if (error) {
			winston.error(error);
			return next(new Error("Authentication Failed"))
		}
		socket._user = new User(body);
		return next();
	});
};

module.exports = io => {
	var rootNamespace = io.of('/')

	// Authentication
	io.use((socket, next) => {
		let session = EnslClient.decodeSession(parseCookies(socket)[config.session_store_name]);

		if (!session || typeof session.user !== 'number') {
			// return next(new Error("Authentication Failed"));

			/* Temporarily Allow Random Users in staging*/
			if (env === 'staging') {
				return assignRandomUser(socket, next);
			} else {
				return next(new Error("Authentication Failed"));
			}
			/****************************/
		}

		client.getUserById({
			id: session.user
		}, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				winston.error(error);
				return next(new Error("Authentication Failed"))
			};
			socket._user = new User(body);
			winston.info("Logged in:", body.username, body.id);
			return next();
		});
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
};
