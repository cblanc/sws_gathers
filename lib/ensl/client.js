"use strict";

var path = require("path");
var crypto = require("crypto");
var request = require("request");
var logger = require("winston");
var Marshal = require("marshal");
var querystring = require('querystring');
var config = require(path.join(__dirname, "../../config/config"));
const SECRET_TOKEN = config.secret_token;
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

EnslClient.parseCookies = (socket) => {
	let cookieString = socket.request.headers.cookie;
	if (typeof cookieString !== 'string') return null;
	let cookies = socket.request.headers.cookie.split(";")
				.map(cookie => cookie.trim())
				.reduce((acc, cookie) => {
					let values = cookie.split("=");
					let attr = values[0];
					let val = values[1];
					if (attr && val) acc[attr] = val;
					return acc;
				}, {})
	return cookies;
};

EnslClient.decodeSession = sessionCookie => {
	if (typeof sessionCookie !== 'string') return null;

	var session = sessionCookie.split("--");
	if (session.length !== 2) return null;

	// Separate text and signature
	var text = querystring.unescape(session[0]);
	var signature = session[1];

	// Verify signature
	if (crypto.createHmac("sha1", SECRET_TOKEN).update(text).digest('hex') !== signature) return null;

	var parsedSession;
	try {
		parsedSession = (new Marshal((new Buffer(text, "base64")).toString("ascii"))).parsed;
	} catch (e) {
		logger.error(e);
	}

	console.log(parsedSession)

	return parsedSession || null;
};

module.exports = EnslClient;
