"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const pubsub = require(path.join(__dirname, "../../lib/event/pubsub.js"));
const winston = require("winston");

const eventSchema = new Schema({
	type: { type: String, required: true },
	description: { type: String },
	meta: { type: Schema.Types.Mixed },
	public: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now, required: true }
});

eventSchema.index({ createdAt: -1 });
eventSchema.index({ type: 1 });

eventSchema.post("save", event => {
	pubsub.emit("newEvent", event);
});

eventSchema.statics.joiner = function (user) {
	winston.info("Gather Joiner", JSON.stringify(user));
	this.create({
		type: "gather:joiner",
		description: `${user.username} joined the gather`,
		public: true
	});
};

eventSchema.statics.leaver = function (user) {
	winston.info("Gather Leaver", JSON.stringify(user));
	this.create({
		type: "gather:leaver",
		description: `${user.username} left the gather`,
		public: true
	});
};

module.exports = mongoose.model('Event', eventSchema);
