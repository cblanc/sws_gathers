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

const Map = require("./map");
const Server = require("./server");
const mongoose = require("mongoose");
const GatherPool = require("./gather_pool");
const ArchivedGather = mongoose.model("ArchivedGather");
const Event = mongoose.model("Event");
const _ = require("lodash");
const winston = require("winston");

const emitGather = (socket, gather) => {
	socket.emit("gather:refresh", {
		gather: gather ? gather.toJson() : null,
		type: gather ? gather.type : null,
		maps: Map.list,
		servers: Server.list
	});	
}

module.exports = function (namespace) {
	const refreshArchive = () => {
		ArchivedGather.recent((error, recentGathers) => {
			if (error) return winston.error(error);
			namespace.emit("gather:archive:refresh", {
				archive: recentGathers,
				maps: Map.list,
				servers: Server.list
			});
		});
	};

	const refreshGather = type => {
		if (type === undefined) {
			for (let attr in gatherRefreshers) {
				gatherRefreshers[attr].call();
			}
		} else {
			const refresh = gatherRefreshers[type];
			if (refresh) refresh();
		}
	}

	const gatherRefreshers = {}; // Stores debounced procedures to refresh gathers

	GatherPool.forEach((gatherManager, type) => {
		let config = gatherManager.config;
		gatherManager.registerCallback('onDone', refreshGather.bind(null, type));
		gatherManager.registerCallback('onEvent', refreshGather.bind(null, type));
		gatherManager.registerCallback('onEvent', (event, from, to) => {
			if (from !== to) {
				namespace.emit("stateChange", {
					type: type,
					event: event,
					state: {
						from: from,
						to: to
					}
				});
			}
		});

		gatherManager.onArchiveUpdate(refreshArchive);

		gatherRefreshers[type] = _.debounce(function () {
			namespace.emit("gather:refresh", {
				gather: gatherManager.current ? gatherManager.current.toJson() : null,
				type: gatherManager.current ? gatherManager.current.type : null,
				maps: Map.list,
				servers: Server.list
			});
		}, 200, {
			leading: true,
			trailing: true
		});

		gatherManager.restart();
	});

	// ***** Generate Test Users *****
	if (process.env.POPULATE_GATHER) {
		let helper = require("./helper");

		GatherPool.forEach(gatherManager => {
			helper.createTestUsers({ 
				gather: gatherManager.current 
			}, refreshGather());			
		});
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
			if (!data) data = {};
			const gatherManager = GatherPool.get(data.type);
			if (!gatherManager) return;
			const gather = gatherManager.current;
			if (gather.can("addGatherer")) gather.addGatherer(socket._user);
			Event.joiner(socket._user);
			refreshGather(data.type);
		});

		socket.on("gather:refresh", function (data) {
			// Refresh all gathers
			if (!data) data = {};
			if (data.type === undefined) {
				GatherPool.forEach(manager => emitGather(socket, manager.current));
				return;
			}
			// Otherwise refresh specified gather
			const gatherManager = GatherPool.get(data.type);
			if (gatherManager == undefined) return;
			emitGather(socket, gatherManager.current)
		});

		const removeGatherer = (gather, user) => {
			let gatherLeaver = gather.getGatherer(user);
			if (gather.can("removeGatherer")) {
				gather.removeGatherer(user);
			}
			if (user.cooldown) gather.applyCooldown(user);
			Event.leaver(gatherLeaver.user);
			refreshGather(gather.type);
		}

		socket.on("gather:leave", function (data) {
			if (!data) data = {};
			const gatherManager = GatherPool.get(data.type);
			if (!gatherManager) return;
			const gather = gatherManager.current;
			if (data.gatherer) {
				// Remove gatherer defined by ID (admins only)
				if (!socket._user.isGatherAdmin()) return;
				removeGatherer(gather, { id: data.gatherer, cooldown: true });
			} else {
				// Remove gatherer attached to socket
				removeGatherer(gather, socket._user);
			}
		});

		socket.on("gather:select", function (data) {
			if (!data) data = {};
			const gatherManager = GatherPool.get(data.type);
			if (!gatherManager) return;
			const gather = gatherManager.current;

			let playerId = data.player;
			// Check team & leader
			let gatherer = gatherPool.getGatherer(socket._user);

			// Cancel if not gatherer or leader
			if (gatherer === null || gatherer.leader === false) {
				return null;
			}

			// Cancel if id belongs to a leader
			let selectedPlayer = gatherPool.getGatherer({id: playerId});

			if (selectedPlayer === null || selectedPlayer.leader) {
				return null;
			}

			let team = gatherer.team;

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

			Event.playerSelected(socket._user, data, gather);

			refreshGather(data.type);
		});

		socket.on("disconnect", function () {
			
		});

		socket.on("gather:vote", function (data) {
			if (!data) data = {};
			const gatherManager = GatherPool.get(data.type);
			if (!gatherManager) return;
			const gather = gatherManager.current;

			if (data.leader) {
				gather.selectLeader(socket._user, data.leader.candidate);
				Event.leaderVote(socket._user, data, gather);
			}

			if (data.map) {
				gather.toggleMapVote(socket._user, data.map.id);
				Event.mapVote(socket._user, data, gather, Map.list);
			}

			if (data.server) {
				gather.toggleServerVote(socket._user, data.server.id);
				Event.serverVote(socket._user, data, gather, Server.list);
			}

			if (typeof data.regather === 'boolean' && gather.can("regather")) {
				gather.regather(socket._user, data.regather);
			}

			refreshGather(data.type);
		});

		socket.on("gather:reset", function (data) {
			if (!data) data = {};
			const gatherManager = GatherPool.get(data.type);
			if (!gatherManager) return;
			if (socket._user.isGatherAdmin()) {
				GatherManager.reset();
				refreshGather(data.type);
				Event.adminRegather(socket._user);
			}
		});

		// Refresh gather
		for (let attr in gatherRefreshers) {
			gatherRefreshers[attr].call();
		}
	});
};
