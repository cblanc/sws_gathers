"use strict";

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");

var createTestUsers = function (options) {
	var gather = options.gather;

	var getRandomUser = function (callback) {
		var id = Math.floor(Math.random() * 5000) + 1;
		client.getUserById({
			id: id
		}, function (error, response, body) {
			if (response.statusCode !== 200) return getRandomUser(callback);
			return callback(error, response, body);
		});
	};

	var instructions = [];
	for (var i = 0; i < 11; i++) {
		instructions.push(function (callback) {
			getRandomUser(function (error, response, body) {
				if (error) return callback(error);
				console.log(body.username, body.id);
				if (gather.can("addGatherer")) {
					gather.addGatherer(new User(body));
				}
				callback();
			});
		});
	};

	async.parallel(instructions, function (error) {
		if (error) {
			console.log("Error while adding gatherers", error);
		} else {
			console.log("Loaded gatherers");
			gather.gatherers.forEach(function (gatherer, index, array) {
				var candidate = Math.floor(Math.random() * array.length);
				array[index].leaderVote = array[candidate].id;
			});
			console.log("Assigned vote for each gatherer");
		}
	});
};

module.exports = {
	createTestUsers: createTestUsers
}