"use strict";

var Author = require("./author");

function Message (o) {
	this.author = Author(o.author);
	this.content = o.content;
	this.createdAt = new Date();
};

Message.prototype.toJson = function () {
	return {
		author: {
			username: this.author.username,
			avatar: this.author.avatar
		},
		content: this.content,
		createdAt: this.createdAt
	}
};

module.exports = Message;