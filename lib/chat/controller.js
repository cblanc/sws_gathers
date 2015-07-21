"use strict";

/*
 * Chatroom Controller
 *
 * Server API
 * message:new - New message needs to be displayed
 * message:refresh - Reload all messages
 *
 * Client API
 * message:new - New message has been created
 * message:refresh - Retrieve most recent messages
 *
 */

var chatroom = require("./chatroom")();

module.exports = function (namespace) {

	var broadcastUpdate = function (message) {
		namespace.emit("message:new", message.toJson());
	};

	namespace.on('connection', function (socket) {

		socket.on('message:new', function (data) {
			chatroom.createMessage({
				author: socket._user,
				content: data.content
			}, broadcastUpdate);
		});

		socket.on('message:refresh', function () {
			socket.emit("message:refresh", {
				chatHistory: chatroom.retrieveMessages(20)
			});
		});
	});
};
