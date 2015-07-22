"use strict";

var fs = require("fs");
var path = require("path");
var enslClient = require(path.join(__dirname, "../lib/ensl/client"))();
var chatController = require(path.join(__dirname, "../lib/chat/controller"));
var gatherController = require(path.join(__dirname, "../lib/gather/controller"));
var winston = require("winston");

var rootNamespace;

var userCache = {};
var refreshUsers = function (socket) {
	var receiver = (socket !== undefined) ? socket : rootNamespace;
	
	var newCache = {};
	rootNamespace.sockets.forEach(function (socket) {
		var user = socket._user;
		newCache[user.id] = user;
	});
	userCache = newCache;

	var users = [];

	for (var id in userCache) {
		if (userCache.hasOwnProperty(id)) {
			users.push(userCache[id]);
		}
	}

	receiver.emit('userCount', {
		count: users.length,
		users: users
	});		
};

module.exports = function (io) {
	rootNamespace = io.of("/");

	var id = 2131;

	// Authorisation
	rootNamespace.use(function (socket, next) {
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

	io.on('connection', function (socket) {
		refreshUsers();
	  
		socket.on('refreshUsers', refreshUsers.bind(null, socket));

		socket.on("authorize:id", function (data) {
			var id = parseInt(data.id, 10);
			if (isNaN(id)) return;
			enslClient.getUserById({
				id: id
			}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					winston.error("An error occurred in authorising id", id);
					winston.error(error);
					winston.error("ENSL API status:", response.statusCode);
					return;
				}
				socket._user = body;
				refreshUsers();
			});
		});

	  socket.on('disconnect', function (socket) {
	    refreshUsers();
	  });
	});

	// Activate chat controller on rootNamespace namespace
	chatController(rootNamespace);
	
	// Activate gather controller on rootNamespace namespace
	gatherController(rootNamespace);
};
