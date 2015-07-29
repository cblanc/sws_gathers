"use strict";

var fs = require("fs");
var path = require("path");
var source = JSON.parse(fs.readFileSync(path.join(__dirname, "../../config/data/servers.json")));
var serverList = source.servers;

function Server () {

}

Server.list = serverList;

module.exports = Server;
