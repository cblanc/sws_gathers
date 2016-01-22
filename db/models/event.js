"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const path = require("path");
const pubsub = require(path.join(__dirname, "../../lib/event/pubsub.js"));
const winston = require("winston");

const eventSchema = new Schema({
	eventType: { type: String, required: true },
	description: { type: String },
	meta: { type: Schema.Types.Mixed },
	public: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now, required: true }
});

eventSchema.index({ createdAt: -1 });
eventSchema.index({ eventType: 1 });

eventSchema.post("save", event => {
	pubsub.emit("newEvent", event);
});

eventSchema.statics.joiner = function (user) {
	winston.info("Gather Joiner", JSON.stringify(user));
	this.create({
		eventType: "gather:joiner",
		description: `${user.username} joined the gather`,
		public: true
	});
};

eventSchema.statics.leaver = function (user) {
	winston.info("Gather Leaver", JSON.stringify(user));
	this.create({
		eventType: "gather:leaver",
		description: `${user.username} left the gather`,
		public: true
	});
};

eventSchema.statics.playerSelected = function (user, data, gather) {
	winston.info("Selection Data", JSON.stringify(user), JSON.stringify(data));
	const gatherer = gather.getGatherer({id: data.player});
	const description = `${user.username} selected ${gatherer.user.username} into ${gatherer.team} team`;
	this.create({
		eventType: "gather:select",
		description: description,
		public: true
	});
};

eventSchema.statics.leaderVote = function (user, data, gather) {
	winston.info("Vote Data", JSON.stringify(user), JSON.stringify(data));
	const gatherer = gather.getGatherer({ id: data.leader.candidate });
	if (gatherer === null) return;
	this.create({
		eventType: "gather:vote:leader",
		description: `${user.username} voted for ${gatherer.user.username}`,
		public: true
	});
};

eventSchema.statics.adminRegather = function (user) {
	this.create({
		eventType: "gather:reset",
		description: `${user.username} reset the gather`,
		public: true
	});
};

eventSchema.statics.mapVote = function (user, data, gather, maps) {
	const gatherer = gather.getGatherer(user);
	if (gatherer.mapVote.some(mapId => mapId === data.map.id)) {
		let map = maps.reduce((prev, curr) => {
			if (curr.id === data.map.id) return curr;
			return prev;
		});
		this.create({
			eventType: "gather:vote:map",
			description: `${user.username} voted for map ${map.name}`,
			public: true
		});
	}
};

eventSchema.statics.serverVote = function (user, data, gather, servers) {
	const gatherer = gather.getGatherer(user);
	if (gatherer.serverVote.some(serverId => serverId === data.server.id)) {
		let server = servers.reduce((prev, curr) => {
			if (curr.id === data.server.id) return curr;
			return prev;
		});
		this.create({
			eventType: "gather:vote:server",
			description: `${user.username} voted for server ${server.name || server.description}`,
			public: true
		});
	}
};

module.exports = mongoose.model('Event', eventSchema);
