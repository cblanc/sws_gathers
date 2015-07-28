"use strict";

/*
 * Gather Controller
 *
 * Server API
 * gather:refresh - Refreshes active gather
 * gather:notification - Creates a notification
 *
 * Client API
 * gather:join - Assigns user to gather
 * gather:vote - Assigns vote to map, leader or server
 *
 */

var Gather = require("./gather");
var gather = new Gather();



// ***** Temporary code to test voting *****

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");

var getRandomUser = function (callback) {
	var id = Math.floor(Math.random() * 5000) + 1;
	console.log(id);
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

// ***** Temporary code to test voting *****


module.exports = function (namespace) {
	var refreshGather = function () {
		namespace.sockets.forEach(function (socket) {
			socket.emit("gather:refresh", {
				gather: gather.toJson(),
				currentGatherer: gather.getGatherer(socket._user)
			});
		});
	};

	namespace.on("connection", function (socket) {
		socket.on("gather:join", function (data) {
			if (gather.can("addGatherer")) {
				gather.addGatherer(socket._user);
				refreshGather();
			}
		});

		socket.on("gather:leave", function (data) {
			if (gather.can("removeGatherer")) {
				gather.removeGatherer(socket._user);
				refreshGather();
			}
		});

		socket.on("disconnect", function () {
			
		});

		socket.on("gather:vote", function (data) {
			if (data.leader) {
				gather.selectLeader(socket._user, data.leader.candidate);
			}
			refreshGather();
		});

		refreshGather();
	});
};
