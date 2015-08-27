"use strict";

var path = require("path");
var mongoose = require("mongoose");
var config = require(path.join(__dirname, "../config/config.js"));

mongoose.connect(config.mongo.uri);

// Load models
require(path.join(__dirname, "/models/message"));
require(path.join(__dirname, "/models/session"));
require(path.join(__dirname, "/models/profile"));

module.exports = mongoose;