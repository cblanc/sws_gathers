"use strict";

var Author = require("./author");

function Message (o) {
	this.author = Author(o.author);
	this.content = o.content;
	this.createdAt = new Date();
};

Message.prototype.toJson = function () {
	return {
		author: this.author,
		content: this.content,
		createdAt: this.createdAt
	}
};

module.exports = Message;