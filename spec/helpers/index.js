"use strict";

var fs = require("fs");
var path = require("path");

var helpers = {}

helpers.app = require(path.join(__dirname, "../../index.js"));

module.exports = helpers;