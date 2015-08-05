"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	author: {
		username: { type: String, required: true },
		avatar: String
	},
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true }
});

messageSchema.index({ createdAt: -1 });

messageSchema.methods.toJson = function () {
	return {
		id: this.id,
		author: this.author,
		content: this.content,
		createdAt: this.createdAt
	};
};

module.exports = mongoose.model('message', messageSchema);
