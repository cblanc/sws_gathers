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

messageSchema.index({ createdAt: 1 });

// Class Methods

messageSchema.statics.list = function (options, callback) {

}

// Instance Methods

messageSchema.methods.toJson = function () {
	return {
		id: this.id,
		author: this.author,
		content: this.content,
		createdAt: this.createdAt
	};
};


messageSchema.statics.list = function (callback) {
	return this.find().sort({createdAt: 1}).limit(30).exec(callback);
};

module.exports = mongoose.model('message', messageSchema);
