"use strict";

var request = require("request");
var env = process.env.NODE_ENV || "development";

const MAP_CATEGORY = 45;
const SERVER_CATEGORY = 44;

function EnslClient (options) {
	if (!(this instanceof EnslClient)) {
		return new EnslClient(options);
	}

	this.baseUrl = (env === "production") ? "http://www.ensl.org" : "http://staging.ensl.org";
}

EnslClient.prototype.getUserById =  (options, callback) => {
	var id = options.id;
	var url = this.baseUrl + "/api/v1/users/" + id;
	return request({
		url: url,
		json: true
	}, callback);
};

EnslClient.prototype.getServers = callback => {
	const url = this.baseUrl + "/api/v1/servers";
	return request({
		url: url,
		json: true
	}, (error, _, data) => {
		if (error) return callback(error);
		return callback(null, {
			servers: data.servers.filter(function (server) {
				return server.category_id === SERVER_CATEGORY;
			})
		});
	});
};

EnslClient.prototype.getMaps = callback => {
	const url = this.baseUrl + "/api/v1/maps";
	return request({
		url: url,
		json: true
	}, (error, _, data) => {
		if (error) return callback(error);
		return callback(null, {
			maps: data.maps.filter(map => {
				return map.category_id === MAP_CATEGORY;
			})
		});
	});
};

EnslClient.prototype.getFullAvatarUri = url => {
	return this.baseUrl + url;
};

module.exports = EnslClient;