"use strict";

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");

var getRandomUser = callback => {
	let id = Math.floor(Math.random() * 5000) + 1;
	User.find(id, function (error, user) {
		if (error) return getRandomUser(callback);
		return callback(error, user);
	})
};

module.exports = {
	getRandomUser: getRandomUser
};


