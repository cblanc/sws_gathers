"use strict";

var env = process.env.NODE_ENV || "development";

var fs = require("fs");
var path = require("path");

var baseConfig = require(path.join(__dirname, path.join("environments/" + env.toLowerCase())));

if (process.env.PORT) {
	baseConfig.port = parseInt(process.env.PORT, 10);
}

if (process.env.MONGOLAB_URI) {
	baseConfig.mongo.uri = process.env.MONGOLAB_URI;
}

if (process.env.RAILS_SECRET) {
	baseConfig.secret_token = process.env.RAILS_SECRET;
}

module.exports = baseConfig;
