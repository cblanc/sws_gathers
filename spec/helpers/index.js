"use strict";

var fs = require("fs");
var path = require("path");

var helpers = {}

helpers.server = require(path.join(__dirname, "../../index.js"));

helpers.app = helpers.server.app;

module.exports = helpers;