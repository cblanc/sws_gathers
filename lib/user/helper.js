"use strict";

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");

var getRandomUser = callback => {
	let id = Math.floor(Math.random() * 5000) + 1;
	client.getUserById({
		id: id
	}, (error, response, body) => {
		if (response.statusCode !== 200) return getRandomUser(callback);
		return callback(error, response, body);
	});
};

module.exports = {
	getRandomUser: getRandomUser
};
