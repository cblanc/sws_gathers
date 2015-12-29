/*
 * Events Controller
 *
 * Server API
 * event:append - New event to be added to history
 *
 */

const winston = require("winston");
const pubsub = require("./pubsub.js");

module.exports = namespace => {
	pubsub.on("newEvent", event => {
		if (!event.public) return;
		namespace.emit("event:append", {
			type: event.type,
			description: event.description,
			createdAt: event.createdAt
		})
	});
};
