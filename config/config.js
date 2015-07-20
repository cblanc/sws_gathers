"use strict";

var env = process.env.NODE_ENV || "development";

var fs = require("fs");
var path = require("path");

var baseConfig = require(path.join(__dirname, path.join("environments/" + env)));

module.exports = baseConfig;