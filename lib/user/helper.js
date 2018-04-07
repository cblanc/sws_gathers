"use strict";

var User = require("../user/user");
var client = require("../ensl/client")();
var async = require("async");

//let ids = [6186, 5891, 5890, 2131, 4928, 6301, 3788, 4233];

var getRandomUser = callback => {
	let id = Math.floor(Math.random() * 5000) + 1;
 	/* if (ids.length) {
		id = ids.pop();
	}  */ 
	User.find(id, function (error, user) {
		if (error) return getRandomUser(callback);
		return callback(error, user);
	})
};

module.exports = {
	getRandomUser: getRandomUser
};
