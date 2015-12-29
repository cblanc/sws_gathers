"use strict";

const helper = require("./helpers/index.js");
const Event = helper.Event;
const assert = require("chai").assert;
const async = require("async");
const pubsub = helper.eventPubSub;

describe("Event Model", () => {
	before(done => {
		helper.clearDb(done);
	});

	afterEach(done => {
		helper.clearDb(done);
	});

	describe(".create", () => {
		it ("creates a new event", done => {
			const event = {
				type: "event",
				description: "An event occurred",
				meta: {
					foo: "bar"
				}
			};
			Event.create(event, (error, result) => {
				if (error) return done(error);
				assert.equal(result.type, event.type);
				assert.equal(result.description, event.description);
				assert.equal(result.description, event.description);
				assert.isDefined(result.createdAt);
				done();
			});
		});
		it ("emits an event when an event is created", done => {
			const event = {
				type: "event",
				description: "An event occurred",
				meta: {
					foo: "bar"
				}
			};
			Event.create(event, error => {
				if (error) return done(error);
			});
			pubsub.once("newEvent", newEvent => {
				assert.equal(newEvent.type, event.type);
				assert.equal(newEvent.description, event.description);
				assert.equal(newEvent.description, event.description);
				assert.isDefined(newEvent.createdAt);
				done();
			});
		});
	});
});