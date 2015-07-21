"use strict";

var Message = require("./message");

function Chatroom (o) {
	if (!(this instanceof Chatroom)) {
		return new Chatroom(o);
	}

	this.messages = [];
};

Chatroom.prototype.createMessage = function (options, callback) {
	var message = new Message({
		author: options.author,
		content: options.content
	})
	this.messages.push(message);

	if (callback) {
		return callback(message);
	}
};

Chatroom.prototype.retrieveMessages = function (n) {
	return this.messages
		.slice(this.messages.length - n, this.messages.length)
		.map(function (message) {
			return message.toJson();
		});
};

module.exports = Chatroom;
