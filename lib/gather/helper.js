"use strict";

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");
var getRandomUser = require("../user/helper").getRandomUser;

var createTestUsers = (options, callback) => {
	var gather = options.gather;

	var instructions = [];
	for (var i = 0; i < 11; i++) {
		instructions.push(callback => {
			getRandomUser((error, user) => {
				if (error) return callback(error);
				if (gather.can("addGatherer")) {
					gather.addGatherer(user);
				}
				callback();
			});
		});
	};

	async.parallel(instructions, (error) => {
		if (error) {
			console.log("Error while adding gatherers", error);
		} else {
			console.log("Loaded gatherers");
			gather.gatherers.forEach((gatherer, index, array) => {
				var candidate = Math.floor(Math.random() * array.length);
				array[index].leaderVote = array[candidate].id;
			});
			console.log("Assigned vote for each gatherer");
			if (typeof callback === 'function') return callback(gather);
		}
	});
};

module.exports = {
	createTestUsers: createTestUsers
};