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
var Gather = require("./gather_singleton");
var _ = require("lodash");
var winston = require("winston");

module.exports = function (namespace) {
	var refreshGather = _.debounce(function () {
		namespace.sockets.forEach(function (socket) {
			socket.emit("gather:refresh", {
				gather: Gather.current.toJson(),
				currentGatherer: Gather.current.getGatherer(socket._user),
				maps: Map.list,
				servers: Server.list,
				previousGather: Gather.previous
			});
		});
	}, 200, {
		leading: true,
		trailing: true
	});

	Gather.registerCallback('onDone', refreshGather);
	Gather.registerCallback('onEvent', refreshGather);
	Gather.restart();

	// ***** Generate Test Users *****
	if (process.env.POPULATE_GATHER) {
		let helper = require("./helper");
		helper.createTestUsers({ gather: Gather.current }, refreshGather);
	}
	
	namespace.on("connection", function (socket) {
		socket.on("gather:join", function (data) {
			let gather = Gather.current;
			if (gather.can("addGatherer")) gather.addGatherer(socket._user);
			winston.info("Gather Joiner", JSON.stringify(socket._user));
			refreshGather();
		});

		socket.on("gather:refresh", function () {
			socket.emit("gather:refresh", {
				gather: Gather.current.toJson(),
				currentGatherer: Gather.current.getGatherer(socket._user)
			});
		});

		let removeGatherer = user => {
			let gather = Gather.current;
			if (gather.can("removeGatherer")) gather.removeGatherer(user);
			winston.info("Gather Leaver", JSON.stringify(user));
			refreshGather();
		}

		socket.on("gather:leave", function (data) {
			if (data && data.gatherer) {
				// Remove gatherer defined by ID (admins only)
				if (!socket._user.admin) return;
				removeGatherer({ id: data.gatherer });
			} else {
				// Remove gatherer attached to socket
				removeGatherer(socket._user);
			}
		});

		socket.on("gather:select", function (data) {
			let gather = Gather.current;
			let playerId = data.player;
			// Check team & leader
			let gatherLeader = gather.getGatherer(socket._user);

			// Cancel if not gatherer or leader
			if (gatherLeader === null || gatherLeader.leader === false) {
				return null;
			}

			// Cancel if id belongs to a leader
			let selectedPlayer = gather.getGatherer({id: playerId});

			if (selectedPlayer === null || selectedPlayer.leader) {
				return null;
			}

			let team = gatherLeader.team;

			let method = (team === 'alien') ? gather.moveToAlien : gather.moveToMarine;
			method.call(gather, selectedPlayer.user, socket._user);

			// Check if last player and add to last team
			if (gather.lobby().length === 1) {
				let assignLast = (gather.marines().length === 6) ? 
					gather.moveToAlien : gather.moveToMarine;
				assignLast.call(gather, gather.lobby().pop());
			}

			if (gather.can("confirmSelection")) {
				gather.confirmSelection(socket._user);
			}

			winston.info("Selection Data", 
					JSON.stringify(socket._user), 
					JSON.stringify(data));

			refreshGather();
		});

		socket.on("disconnect", function () {
			
		});

		socket.on("gather:vote", function (data) {
			let gather = Gather.current;
			if (data.leader) {
				gather.selectLeader(socket._user, data.leader.candidate);
			}

			if (data.map) {
				gather.voteForMap(socket._user, data.map.id);
			}

			if (data.server) {
				gather.voteForServer(socket._user, data.server.id);	
			}

			winston.info("Vote Data", 
					JSON.stringify(socket._user), 
					JSON.stringify(data));

			refreshGather();
		});

		socket.on("gather:reset", function () {
			if (socket._user.admin) {
				Gather.reset();
				refreshGather();
			}
		});

		refreshGather();
	});
};
