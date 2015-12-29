"use strict";

var path = require("path");
var winston = require("winston");
var mongoose = require("mongoose");
var config = require(path.join(__dirname, "../config/config.js"));

var connect = function () {
	mongoose.connect(config.mongo.uri, { 
		server: { 
			socketOptions: { 
				keepAlive: 1, 
				connectTimeoutMS: 30000 
			} 
		} 
	});
};

connect();

mongoose.connection.on("error", function (error) {
	winston.error(error);
});

mongoose.connection.on("disconnected", function () {
	winston.error("MongoDB: Was disconnected.");
});

// Load models
require(path.join(__dirname, "/models/event"));
require(path.join(__dirname, "/models/message"));
require(path.join(__dirname, "/models/session"));
require(path.join(__dirname, "/models/profile"));
require(path.join(__dirname, "/models/archivedGather"));

module.exports = mongoose;
