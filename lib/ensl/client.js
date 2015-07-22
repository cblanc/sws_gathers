"use strict";

var request = require("request");
var env = process.env.NODE_ENV || "development";

function EnslClient (options) {
	if (!(this instanceof EnslClient)) {
		return new EnslClient(options);
	}

	this.baseUrl = (env === "production") ? "http://www.ensl.org" : "http://staging.ensl.org";
}

EnslClient.prototype.getUserById = function (options, callback) {
	var id = options.id;
	var url = this.baseUrl + "/api/v1/users/" + id;
	request({
		url: url,
		json: true
	}, callback);
};

EnslClient.prototype.getFullAvatarUri = function (url) {
	return this.baseUrl + url;
}

module.exports = EnslClient;