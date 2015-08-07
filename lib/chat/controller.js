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

var mongoose = require("mongoose");
var Message = mongoose.model("message");

module.exports = function (namespace) {

	var broadcastUpdate = function (message) {
		namespace.emit("message:new", message.toJson());
	};

	namespace.on('connection', function (socket) {

		socket.on('message:new', function (data) {
			Message.create({
				author: {
					username: socket._user.username,
					avatar: socket._user.avatar
				},
				content: data.content
			}, function (error, newMessage) {
				if (error) {
					winston.error("Unable to store message. Error:", error);
					return;
				}
				broadcastUpdate(newMessage)
			});
		});

		socket.on('message:refresh', function () {
			Message.list({}, function (error, messages) {
				if (error) {
					winston.error("Unable to retrieve messages. Error:", error);
					return;
				}
				socket.emit("message:refresh", {
					chatHistory: messages
				});
			});
		});
	});
};
