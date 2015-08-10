"use strict";

var fs = require("fs");
var path = require("path");
var winston = require("winston");
var client = require(path.join(__dirname, "../ensl/client"))();
var serverFile = path.join(__dirname, "../../config/data/servers.json");

const REFRESH_INTERVAL = 1000 * 60 * 60; // Check every hour

function Server () {

}

Server.updateServerList = () => {
	client.getServers((error, result) => {
		if (error) {
			winston.error("Unable to download server list")
			winston.error(error);
			return;
		};
		Server.list = result.servers;
	});
};

Server.list = JSON.parse(fs.readFileSync(serverFile)).servers;

Server.updateServerList();

setInterval(Server.updateServerList, REFRESH_INTERVAL);

module.exports = Server;
