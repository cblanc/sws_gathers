"use strict";

const path = require("path");
const request = require("request");
const logger = require("winston");
const querystring = require('querystring');
const config = require(path.join(__dirname, "../../config/config"));

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
	return request({
		url: `${this.baseUrl}api/get/playerData/${user.hive.id}`,
		json: true
	}, callback);
};

module.exports = HiveClient;
