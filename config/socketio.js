"use strict";

var fs = require("fs");
var path = require("path");
var enslClient = require(path.join(__dirname, "../lib/ensl/client"))();
var chatController = require(path.join(__dirname, "../lib/chat/controller"));
var winston = require("winston");

var gathererCache = {};

module.exports = function (io) {
	var root = io.of("/");
	var authorised = io.of("/authorised");



	var id = 2131;

	// Authorisation
	root.use(function (socket, next) {
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

	var refreshGatherers = function (socket) {
		var receiver = (socket !== undefined) ? socket : root;
		
		var newCache = {};
		root.sockets.forEach(function (socket) {
			var user = socket._user;
			newCache[user.id] = user;
		});
		gathererCache = newCache;

		var gatherers = [];

		for (var id in gathererCache) {
			if (gathererCache.hasOwnProperty(id)) {
				gatherers.push(gathererCache[id]);
			}
		}

		receiver.emit('gatherCount', {
			count: root.sockets.length,
			gatherers: gatherers
		});		
	};

	// Activate chat controller on root namespace
	chatController(root);

	io.on('connection', function (socket) {
		refreshGatherers();
	  
		socket.on('refreshGathers', refreshGatherers.bind(null, socket));

		socket.on("authorize:id", function (data) {
			var id = parseInt(data.id, 10);
			if (isNaN(id)) return;
			enslClient.getUserById({
				id: id
			}, function (error, response, body) {
				if (error) {
					return winston.error(error);
				}
				socket._user = body;
				refreshGatherers();
			});
		});

	  socket.on('disconnect', function (socket) {
	    refreshGatherers();
	  });
	});
};
