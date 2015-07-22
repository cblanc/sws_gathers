"use strict";

var fs = require("fs");
var path = require("path");
var enslClient = require(path.join(__dirname, "../lib/ensl/client"))();
var chatController = require(path.join(__dirname, "../lib/chat/controller"));
var winston = require("winston");

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
		
		receiver.emit('gatherCount', {
			count: root.sockets.length,
			gatherers: root.sockets.map(function (socket) {
				return socket._user
			})
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
