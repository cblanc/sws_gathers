"use strict";

/*
 *	Implements User Model
 *
 */ 

var client = require("../ensl/client")();
var mongoose = require("mongoose");
var Profile = mongoose.model("Profile");

function User (user) {
	this.id = user['id'];
	this.online = true;
	this.username = user['username'];
	this.country = user['country'];
	this.time_zone = user['time_zone'];
	this.avatar = client.baseUrl + user['avatar'];
	this.admin = user['admin'];
	this.team = user['team'];
	this.bans = user['bans'];
	if (user['steam']) {
		this.steam = {
			url: user['steam']['url'],
			nickname: user['steam']['nickname']
		};
	} else {
		this.steam = {
			url: null,
			nickname: null
		};
	}
	this.profile = null;
}

User.find = (id, callback) => {
	client.getUserById({
		id: id
	}, (error, response, body) => {
		if (error) return callback(error);
		if (response.statusCode !== 200) return callback(new Error("Unable to auth user against API"));
		let user = new User(body);
		Profile.findOrCreate(user, function (error, profile) {
			if (error) return callback(error);
			user.profile = profile.toJson();
			return callback(null, user);
		});
	});
};

 module.exports = User;
