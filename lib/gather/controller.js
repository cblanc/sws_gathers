"use strict";

/*
 * Gather Controller
 *
 * Server API
 * gather:refresh - Refreshes active gather
 * gather:select - Selects a player for team
 * gather:notification - Creates a notification
 *
 * Client API
 * gather:join - Assigns user to gather
 * gather:vote - Assigns vote to map, leader or server
 * gather:leave - Leave gather
 * gather:select - Select player for team
 * gather:refresh - Refresh gather for client
 *
 * gather:reset - Resets gather (ADMIN)
 *
 */

var Map = require("./map");
var Server = require("./server");
var Gather = require("./gather");
var gather;
var previousGather;

module.exports = function (namespace) {
	var refreshGather = function () {
		namespace.sockets.forEach(function (socket) {
			socket.emit("gather:refresh", {
				gather: gather.toJson(),
				currentGatherer: gather.getGatherer(socket._user),
				maps: Map.list,
				servers: Server.list,
				previousGather: previousGather
			});
		});
	};

	var newGather = function () {
		if (gather) previousGather = gather;
		gather = Gather({
			onEvent: function () {
				refreshGather();
			},
			onDone:function () {
				newGather();
				refreshGather();
			}
		});	
	}

	newGather();

	// ***** Generate Test Users *****
	var helper = require("./helper");
	helper.createTestUsers({ gather: gather });
	


	namespace.on("connection", function (socket) {
		socket.on("gather:join", function (data) {
			if (gather.can("addGatherer")) gather.addGatherer(socket._user);
			refreshGather();
		});

		socket.on("gather:refresh", function () {
			socket.emit("gather:refresh", {
				gather: gather.toJson(),
				currentGatherer: gather.getGatherer(socket._user)
			});
		});

		socket.on("gather:leave", function (data) {
			if (gather.can("removeGatherer")) gather.removeGatherer(socket._user);
			refreshGather();
		});

		socket.on("gather:select", function (data) {
			var playerId = data.player;
			// Check team & leader
			var gatherLeader = gather.getGatherer(socket._user);

			// Cancel if not gatherer or leader
			if (gatherLeader === null || gatherLeader.leader === false) {
				return null;
			}

			// Cancel if id belongs to a leader
			var selectedPlayer = gather.getGatherer({id: playerId});

			if (selectedPlayer === null || selectedPlayer.leader) {
				return null;
			}

			var team = gatherLeader.team;

			var method = (team === 'alien') ? gather.moveToAlien : gather.moveToMarine;
			method.call(gather, selectedPlayer.user);

			if (gather.can("confirmSelection")) {
				gather.confirmSelection(socket._user);
			}

			refreshGather();
		});

		socket.on("disconnect", function () {
			
		});

		socket.on("gather:vote", function (data) {
			if (data.leader) {
				gather.selectLeader(socket._user, data.leader.candidate);
			}

			if (data.map) {
				gather.voteForMap(socket._user, data.map.id);
			}

			if (data.server) {
				gather.voteForServer(socket._user, data.server.id);	
			}

			refreshGather();
		});

		socket.on("gather:reset", function () {
			if (socket._user.admin) {
				gather = Gather();
				refreshGather();
			}
		});

		refreshGather();
	});
};
