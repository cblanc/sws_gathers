"use strict";

/*
 *	Implements User Model
 *
 */ 

 var client = require("../ensl/client")();

 function User (user) {
 	this.id = user['id'];
 	this.online = true;
	this.username = user['username'];
	this.country = user['country'];
	this.time_zone = user['time_zone'];
	this.avatar = client.baseUrl + user['avatar'];
	this.admin = user['admin'];
	// this.steam = {
	// 	url: user['steam']['url'],
	// 	nickname: user['steam']['nickname']
	// };
	this.ability = {
		division: "Div " + (Math.floor(Math.random() * 4) + 1),
		lifeforms: [["Lerk", "Onos", "Fade"][Math.floor(Math.random() * 3)]],
		commander: true
	}
 }

 module.exports = User;