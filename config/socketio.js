"use strict";

var fs = require("fs");
var path = require("path");
var enslClient = require(path.join(__dirname, "../lib/ensl/client"))();
var chatController = require(path.join(__dirname, "../lib/chat/controller"));
var gatherController = require(path.join(__dirname, "../lib/gather/controller"));
var userController = require(path.join(__dirname, "../lib/user/controller"));
var winston = require("winston");

module.exports = function (io) {
	var id = 2131;

	var rootNamespace = io.of('/')

	// Authorisation
	io.use(function (socket, next) {
		enslClient.getUserById({
			id: id
		}, function (error, response, body) {
			if (error) {
				winston.error(error);
				return next(error)
			};
			socket._user = body;
			next();
		});
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
};
