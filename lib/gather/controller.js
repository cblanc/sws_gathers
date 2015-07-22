"use strict";

/*
 * Gather Controller
 *
 * Server API
 * gather:refresh - Refreshes active gather
 *
 * Client API
 * gather:join - Assigns user to gather
 * gather:vote - Assigns vote to map, captain or server
 *
 */

var Gather = require("./gather");
var latestGather = new Gather();

module.exports = function (namespace) {
	var refreshGather = function () {
		namespace.emit("gather:refresh", {
			gather: gather
		});
	};

	namespace.on("connection", function (socket) {

		socket.on("gather:join", function (data) {

		});

		socket.on("gather:vote", function (data) {

		});
	});
};
