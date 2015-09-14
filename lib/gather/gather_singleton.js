"use strict"

let Gather = require("./gather");
let gatherCallbacks = {};

// Register initial callback to reset gather when state is `done`
gatherCallbacks['onDone'] = [function () {
	rotateGather();
}];

let executeCallbacks = (context, type) => {
	let cbs = gatherCallbacks[type];
	if (!cbs) return;
	cbs.forEach(function (cb) {
		cb.call(context);
	});
};

let newGather = () => {
	return SingletonClass.current = Gather({
		onEvent: function () {
			executeCallbacks(this, 'onEvent')
		},
		onDone: function () {
			executeCallbacks(this, 'onDone')
		}
	});
};

let rotateGather = () => {
	if (SingletonClass.current) SingletonClass.previous = SingletonClass.current;
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
