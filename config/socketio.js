"use strict";

var winston = require("winston");
var User = require("../lib/user/user");
var enslClient = require("../lib/ensl/client")();
var chatController = require("../lib/chat/controller");
var gatherController = require("../lib/gather/controller");
var userController = require("../lib/user/controller");

module.exports = function (io) {
	var rootNamespace = io.of('/')

	// Authorisation
	io.use(function (socket, next) {
		var id = Math.floor(Math.random() * 5000) + 1;
		enslClient.getUserById({
			id: id
		}, function (error, response, body) {
			if (error) {
				winston.error(error);
				return next(error)
			};
			socket._user = new User(body);
			next();
		});
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
};
