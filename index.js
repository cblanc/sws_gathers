"use strict";

require("newrelic");
var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var config = require(path.join(__dirname, "config/config.js"));
var env = process.env.NODE_ENV || "development";

// Load Models
require(path.join(__dirname, "db/index"));

// Initialise Steam Bot
if (env !== "test") {
	require(path.join(__dirname, "lib/steam/bot"))(config.steamBot);
}

// Configure express
require(path.join(__dirname, "config/express"))(app);

// Add routes
require(path.join(__dirname, "config/routes"))(app);

// Configure socket.io server

server.listen(config.port);

require(path.join(__dirname, "config/socketio"))(io);

console.log("Listening on port", config.port);

module.exports = {
	app: app,
	server: server,
	io: io
};