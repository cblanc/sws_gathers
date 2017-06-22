"use strict";

const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const config = require(path.join(__dirname, "config/config.js"));

if (env === "production") require("newrelic");

// Load Models
require(path.join(__dirname, "db/index"));

// Initialise Steam Bot
//if (env !== "test") {
//	require(path.join(__dirname, "lib/steam/bot"))(config.steamBot);
//}

//Initialise Discord Bot
if (env === "production") {
	require(path.join(__dirname, "lib/discord/bot"))(config.discordBot);
}

// Configure express
require(path.join(__dirname, "config/express"))(app);

// Add routes
require(path.join(__dirname, "config/routes"))(app);

// Configure socket.io server
require(path.join(__dirname, "config/socketio"))(io);

server.listen(config.port);
console.log("Listening on port", config.port);

module.exports = {
	app: app,
	server: server,
	io: io
};
