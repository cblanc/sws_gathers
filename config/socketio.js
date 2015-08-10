"use strict";

var winston = require("winston");
var User = require("../lib/user/user");
var client = require("../lib/ensl/client")();
var chatController = require("../lib/chat/controller");
var gatherController = require("../lib/gather/controller");
var userController = require("../lib/user/controller");

var getRandomUser = callback => {
	var id = Math.floor(Math.random() * 5000) + 1;
	client.getUserById({
		id: id
	}, (error, response, body) => {
		if (response.statusCode !== 200) return getRandomUser(callback);
		return callback(error, response, body);
	});
};

module.exports = io => {
	var rootNamespace = io.of('/')

	// Authorisation
	io.use((socket, next) => {
		getRandomUser((error, _, body) => {
			if (error) {
				winston.error(error);
				return next(error)
			};
			socket._user = new User(body);
			console.log("You:", body.username, body.id);
			next();
		})
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
};
