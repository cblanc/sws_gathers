"use strict"

let Gather = require("./gather");
let gatherCallbacks = {};
let archiveUpdatedCallback = () => {};
let winston = require("winston");
let mongoose = require("mongoose");
let ArchivedGather = mongoose.model("ArchivedGather");

// Register initial callback to reset gather when state is `done`
gatherCallbacks['onDone'] = [function () {
	rotateGather();
}];

let newGather = () => {
	return SingletonClass.current = Gather({
		onEvent: function () {
			gatherCallbacks['onEvent'].forEach(cb => {
				cb.apply(this, [].slice.call(arguments))
			});
		},
		onDone: function () {
			gatherCallbacks['onDone'].forEach(cb => {
				cb.apply(this, [].slice.call(arguments))
			});
		}
	});
};

let archiveGather = gather => {
	ArchivedGather.archive(gather, (error, result) => {
		if (error) return winston.error(error);
		if (archiveUpdatedCallback 
			&& typeof archiveUpdatedCallback === 'function') {
			archiveUpdatedCallback();
		}
	});
};

let rotateGather = () => {
	if (SingletonClass.current) {
		SingletonClass.previous = SingletonClass.current;
		archiveGather(SingletonClass.previous);
	}
	return newGather();
}

let SingletonClass = {
	registerCallback: function (type, method) {
		if (gatherCallbacks[type]) {
			gatherCallbacks[type].push(method);
		} else {
			gatherCallbacks[type] = [method];
		}
	},
	onArchiveUpdate: function (callback) {
		archiveUpdatedCallback = callback;
	},
	restart: function () {
		this.previousGather = undefined;
		this.current = undefined;
		return newGather();
	},
	reset: function () {
		return newGather();
	},
	current: Gather(),
	previous: undefined
};

module.exports = SingletonClass;
