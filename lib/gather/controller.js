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

module.exports = function (namespace) {
	var refreshGather = function () {
		namespace.emit("gather:refresh", {
			gather: gather.toJson()
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

		});

		refreshGather();
	});
};
