"use strict";

var path = require("path");
var request = require("request");
var logger = require("winston");
var querystring = require('querystring');
var config = require(path.join(__dirname, "../../config/config"));

function HiveClient (options) {
	if (!(this instanceof HiveClient)) {
		return new HiveClient(options);
	}

	this.baseUrl = config.hive_url;
}

HiveClient.prototype.getUserStats = function (user, callback) {
	if (!user || !user.hive.id) {
		return callback(new Error("Invalid user instance supplied"));
	}

	var id = user.hive.id;
	var url = this.baseUrl + "api/get/playerData/" + id;
	return request({
		url: url,
		json: true
	}, callback);
};

module.exports = HiveClient;
