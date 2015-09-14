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
 * message:delete - Deletes message by ID (Admin only)
 *
 */

var mongoose = require("mongoose");
var Message = mongoose.model("Message");

module.exports = namespace => {

	var broadcastUpdate = message => {
		namespace.emit("message:new", message);
	};

	var refreshMessages = socket => {
		Message.list({}, (error, messages) => {
			if (error) {
				winston.error("Unable to retrieve messages. Error:", error);
				return;
			}

			var receiver = (socket === undefined) ? namespace : socket;

			receiver.emit("message:refresh", {
				chatHistory: messages
			});
		});
	};

	namespace.on('connection', socket => {

		socket.on('message:new', data => {
			Message.create({
				author: {
					username: socket._user.username,
					avatar: socket._user.avatar
				},
				content: data.content
			}, (error, newMessage) => {
				if (error) {
					winston.error("Unable to store message. Error:", error);
					return;
				}
				broadcastUpdate(newMessage)
			});
		});

		socket.on('message:delete', data => {
			var id = data.id;
			if (id === undefined || !socket._user.admin) return;

			Message.remove({_id: id}, error => {
				if (error) {
					winston.error("An error occurred when trying to delete message:", error);
					return;
				}
				refreshMessages();
			});
		});

		socket.on('message:refresh', () => {
			refreshMessages(socket);
		});
	});
};
