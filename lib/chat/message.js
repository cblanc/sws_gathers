"use strict";

var Author = require("./author");
var count = 0;

function Message (o) {
	this.id = count++;
	this.author = Author(o.author);
	this.content = o.content;
	this.createdAt = new Date();
};

Message.prototype.toJson = function () {
	return {
		id: this.id,
		author: this.author,
		content: this.content,
		createdAt: this.createdAt
	}
};

module.exports = Message;