"use strict";

const User = require("../user/user");

const getRandomUser = callback => {
	const id = Math.floor(Math.random() * 5000) + 1;
	User.find(id, function (error, user) {
		if (error) return getRandomUser(callback);
		return callback(error, user);
	})
};

const getFixedUser = (id, callback) => {
	User.find(id, function (error, user) {
		if (error) return getRandomUser(callback);
		return callback(error, user);
	})
};

module.exports = {
    getRandomUser,
    getFixedUser
};


