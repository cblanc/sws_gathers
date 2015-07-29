"use strict";

/*
 * User Controller
 *
 * Server API
 * users:update - Update list of users
 *
 * Client API
 * users:online - User is on the page
 * users:away - User is away from page
 * users:authorize - Authorize user
 * users:refresh - Request new user list
 *
 */

var userCache = {};
var User = require("./user");
var winston = require("winston");
var enslClient = require("../ensl/client")();

module.exports = function (namespace) {
	var refreshUsers = function (socket) {
		var receivers = (socket !== undefined) ? [socket] : namespace.sockets;
		
		var newCache = {};
		namespace.sockets.forEach(function (socket) {
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

		receivers.forEach(function (socket) {
			socket.emit('users:update', {
				count: users.length,
				users: users,
				currentUser: socket._user
			});		
		});
	};

	namespace.on('connection', function (socket) {
		refreshUsers();
	  
		socket.on('users:refresh', refreshUsers.bind(null, socket));

		socket.on('users:online', function () {
			socket._user.online = true;
			refreshUsers();
		});

		socket.on('users:away', function () {
			socket._user.online = false;
			refreshUsers();
		});

		socket.on("users:authorize", function (data) {
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
				socket._user = new User(body);
				refreshUsers();
			});
		});

	  socket.on('disconnect', function (socket) {
	    refreshUsers();
	  });
	});
};
