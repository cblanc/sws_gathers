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
 * users:authorize - Sign on with arbitary user ID (to be enabled for admin only)
 * users:refresh - Request new user list
 *
 */

var userCache = {};
var User = require("./user");
var winston = require("winston");
var mongoose = require("mongoose");
var Session = mongoose.model("Session");
var enslClient = require("../ensl/client")();
var _ = require("lodash");

module.exports = namespace => {
	var refreshUsers = socket => {
		var receivers = (socket !== undefined) ? [socket] : namespace.sockets;
		
		var newCache = {};
		namespace.sockets.forEach(socket => {
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

		receivers.forEach(socket => {
			socket.emit('users:update', {
				count: users.length,
				users: users,
				currentUser: socket._user
			});		
		});
	};

	namespace.on('connection', socket => {
		refreshUsers();
	  
		socket.on('users:refresh', refreshUsers.bind(null, socket));

		socket.on('users:online', () => {
			socket._user.online = true;
		});

		socket.on('users:away', () => {
			socket._user.online = false;
		});

		socket.on('users:update:profile', data => {
			if (socket._user.id !== data.id) return;
			socket._user.updateProfile(data.profile, function (error) {
				if (error) {
					winston.error(error);
					return;
				}
				refreshUsers();
			});
		});

		socket.on("users:authorize", data => {
			if (!socket._user.admin) return;
			var id = parseInt(data.id, 10);
			if (isNaN(id)) return;
			enslClient.getUserById({
				id: id
			}, (error, response, body) => {
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

	  socket.on('disconnect', socket => { refreshUsers(); });
	});
};
