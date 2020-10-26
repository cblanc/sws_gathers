"use strict";

var path = require("path");
var winston = require("winston");
var mongoose = require("mongoose");
var config = require(path.join(__dirname, "../config/config.js"));

var connect = function () {
  mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(
    () => winston.info("MongoDB: Connection established"),
    error => winston.error(error)
  );
};

connect();

mongoose.connection.on("error", (error) => winston.error(error));
mongoose.connection.on("disconnected", () => winston.error("MongoDB: Was disconnected."));
mongoose.connection.on("reconnectFailed", () => winston.error("MongoDB: Reconnect Failed!"));

mongoose.connection.on("reconnected", () => winston.info("MongoDB: Connection established"));

// Load models
require(path.join(__dirname, "/models/event"));
require(path.join(__dirname, "/models/message"));
require(path.join(__dirname, "/models/session"));
require(path.join(__dirname, "/models/profile"));
require(path.join(__dirname, "/models/archivedGather"));

module.exports = mongoose;
