"use strict";

var winston = require("winston");
var User = require("../lib/user/user");
var config = require("./config");
var EnslClient = require("../lib/ensl/client");
var client = EnslClient();
var chatController = require("../lib/chat/controller");
var gatherController = require("../lib/gather/controller");
var userController = require("../lib/user/controller");

var getRandomUser = callback => {
	let id = Math.floor(Math.random() * 5000) + 1;
	client.getUserById({
		id: id
	}, (error, response, body) => {
		if (response.statusCode !== 200) return getRandomUser(callback);
		return callback(error, response, body);
	});
};

var parseCookies = (socket) => {
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

module.exports = io => {
	var rootNamespace = io.of('/')

	// Authentication
	io.use((socket, next) => {
		let session = EnslClient.decodeSession(parseCookies(socket)[config.session_store_name]);

		if (!session || typeof session.user !== 'number') return next(new Error("Authentication Failed"));

		client.getUserById({
			id: session.user
		}, (error, response, body) => {
			if (error) {
				winston.error(error);
				return next(error)
			};
			socket._user = new User(body);
			winston.info("Logged in:", body.username, body.id);
			return next();
		});
	});

	userController(rootNamespace);
	chatController(rootNamespace);
	gatherController(rootNamespace);
};
