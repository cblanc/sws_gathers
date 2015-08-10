"use strict";

var request = require("request");
var env = process.env.NODE_ENV || "development";

const SERVER_CATEGORY = 44;

function EnslClient (options) {
	if (!(this instanceof EnslClient)) {
		return new EnslClient(options);
	}

	this.baseUrl = (env === "production") ? "http://www.ensl.org" : "http://staging.ensl.org";
}

EnslClient.prototype.getUserById = function (options, callback) {
	var id = options.id;
	var url = this.baseUrl + "/api/v1/users/" + id;

	return request({
		url: url,
		json: true
	}, callback);
};

EnslClient.prototype.getServers = function (callback) {
	var url = this.baseUrl + "/api/v1/servers";

	return request({
		url: url,
		json: true
	}, function (error, _, data) {
		if (error) return callback(error);
		return callback(null, {
			servers: data.servers.filter(function (server) {
				return server.category_id === SERVER_CATEGORY;
			})
		});
	});
}

EnslClient.prototype.getFullAvatarUri = function (url) {
	return this.baseUrl + url;
};

module.exports = EnslClient;