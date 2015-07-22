"use strict";

var env = process.env.NODE_ENV || "development";

var fs = require("fs");
var path = require("path");

var baseConfig = require(path.join(__dirname, path.join("environments/" + env)));

if (process.env.PORT) {
	baseConfig.port = parseInt(process.env.PORT, 10);
}

module.exports = baseConfig;