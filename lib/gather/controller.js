"use strict";

/*
 * Gather Controller
 *
 * Server API
 * gather:refresh - Refreshes active gather
 * gather:archive:refresh - Refreshes gather archive
 *
 * Client API
 * gather:join - Assigns user to gather
 * gather:vote - Assigns vote to map, leader or server
 * gather:leave - Leave gather
 * gather:select - Select player for team
 * gather:refresh - Refresh gather for client
 * gather:reset - Resets gather (ADMIN)
 *
 */

var Map = require("./map");
var Server = require("./server");
var mongoose = require("mongoose");
var Gather = require("./gather_singleton");
var ArchivedGather = mongoose.model("ArchivedGather");
var _ = require("lodash");
var winston = require("winston");

module.exports = function (namespace) {
	var refreshGather = _.debounce(function () {
		namespace.emit("gather:refresh", {
			gather: Gather.current ? Gather.current.toJson() : null,
			maps: Map.list,
			servers: Server.list,
			previousGather: Gather.previous ? Gather.previous.toJson() : null
		});
	}, 200, {
		leading: true,
		trailing: true
	});

	var refreshArchive = () => {
		ArchivedGather.recent((error, recentGathers) => {
			if (error) return winston.error(error);
			namespace.emit("gather:archive:refresh", {
				archive: recentGathers,
				maps: Map.list,
				servers: Server.list
			});
		});
	};

	Gather.registerCallback('onDone', refreshGather);
	Gather.registerCallback('onEvent', refreshGather);
	Gather.registerCallback('onEvent', (event, from, to) => {
		if (from === 'gathering' && to === 'election') {
			namespace.emit("notification", {
				sound: "gather_starting"
			});
		}
	});
	Gather.onArchiveUpdate(refreshArchive);
	Gather.restart();

	// ***** Generate Test Users *****
	if (process.env.POPULATE_GATHER) {
		let helper = require("./helper");
		helper.createTestUsers({ gather: Gather.current }, refreshGather);
	}
	
	namespace.on("connection", function (socket) {
		ArchivedGather.recent((error, recentGathers) => {
			if (error) return winston.error(error);
			socket.emit("gather:archive:refresh", {
				archive: recentGathers,
				maps: Map.list,
				servers: Server.list
			});
		});

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
			if (user.cooldown) gather.applyCooldown(user);
			winston.info("Gather Leaver", JSON.stringify(user));
			refreshGather();
		}

		socket.on("gather:leave", function (data) {
			if (data && data.gatherer) {
				// Remove gatherer defined by ID (admins only)
				if (!socket._user.isGatherAdmin()) return;
				removeGatherer({ id: data.gatherer, cooldown: true });
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

			if (typeof data.regather === 'boolean' && gather.can("regather")) {
				gather.regather(socket._user, data.regather);
			}

			winston.info("Vote Data", 
					JSON.stringify(socket._user), 
					JSON.stringify(data));

			refreshGather();
		});

		socket.on("gather:reset", function () {
			if (socket._user.isGatherAdmin()) {
				Gather.reset();
				refreshGather();
			}
		});

		refreshGather();
	});
};
