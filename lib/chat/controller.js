"use strict";

/*
 * Chatroom Controller
 *
 * Server API
 * message:append - New message to be added to history
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
var winston = require("winston");

module.exports = namespace => {
	var broadcastUpdate = message => {
		namespace.emit("message:append", { messages: [message.toJson()]});
	};

	var refreshMessages = socket => {
		Message.list({}, (error, messages) => {
			if (error) {
				winston.error("Unable to retrieve messages. Error:", error);
				return;
			}

			var receiver = (socket === undefined) ? namespace : socket;

			receiver.emit("message:refresh", {
				messages: messages
			});
		});
	};

	var retrievePreviousMessages = (options, socket) => {
		Message.list({
			before: options.before
		}, (error, messages) => {
			if (error) {
				winston.error("Unable to retrieve messages. Error:", error);
				return;
			}
			socket.emit("message:append", {
				messages: messages.map(message => message.toJson())
			});
		});
	}

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
				winston.info("New Message", JSON.stringify(newMessage));
				broadcastUpdate(newMessage);
			});
		});

		socket.on('message:delete', data => {
			var id = data.id;
			if (id === undefined || !socket._user.isChatAdmin()) return;

			Message.update({_id: id}, {deleted: true}, (error, message) => {
				if (error) {
					winston.error("An error occurred when trying to delete message:", error);
					return;
				}
				winston.info("Deleted message", JSON.stringify(data));
				refreshMessages();
			});
		});

		socket.on('message:refresh', data => {
			if (data && data.before) {
				return retrievePreviousMessages(data, socket);
			}
			refreshMessages(socket);
		});
	});
};
