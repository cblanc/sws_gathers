"use strict";

/*
 *	Implements User Model
 *
 */ 

 var client = require("../ensl/client")();

 function User (user) {
 	this.id = user['id'];
	this.username = user['username'];
	this.country = user['country'];
	this.time_zone = user['time_zone'];
	this.avatar = client.baseUrl + user['avatar'];
	this.admin = user['admin'];
	// this.steam = {
	// 	url: user['steam']['url'],
	// 	nickname: user['steam']['nickname']
	// };
 }

 module.exports = User;