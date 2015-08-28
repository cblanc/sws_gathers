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
	this.steam = {
		url: user['steam']['url'] || null,
		nickname: user['steam']['nickname'] || null
	};
	this.profile = null;
}

User.prototype.updateProfile = function (data, callback) {
	let self = this;
	Profile.update({
		userId: self.id
	}, data, function (error) {
		if (error) return callback(error);
		Profile.findOne({userId: self.id}, function (error, profile) {
			if (error) return callback(error);
			self.profile = profile.toJson();
			return callback(error, profile);
		});
	});
};

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
