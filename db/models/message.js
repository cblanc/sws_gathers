"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	author: {
		username: { type: String, required: true },
		avatar: String
	},
	content: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, required: true },
	deleted: { type: Boolean, default: false }
});

messageSchema.index({ createdAt: -1 });
messageSchema.index({ deleted: 1, createdAt: -1 });

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

messageSchema.statics.list = function (options, callback) {
	return this.find({deleted: false}).sort({createdAt: -1}).limit(30).exec(function (error, messages) {
		if (error) return callback(error);
		return callback(null, messages.reverse());
	});
};

module.exports = mongoose.model('message', messageSchema);
