"use strict";

/*
 *	Implements User Model
 *
 */ 

var _ = require("lodash");
var async = require("async");
var mongoose = require("mongoose");
var Profile = mongoose.model("Profile");
var steam = require('steamidconvert')();
var enslClient = require("../ensl/client")();
var hiveClient = require("../hive/client")();

function User (user) {
	this.id = user['id'];
	this.online = true;
	this.username = user['username'];
	this.country = user['country'];
	this.time_zone = user['time_zone'];
	this.avatar = enslClient.baseUrl + user['avatar'];
	this.admin = user['admin'];
	this.team = user['team'];
	this.bans = user['bans'];
	this.steam = {
		id: user['steam']['id'] || null,
		url: user['steam']['url'] || null,
		nickname: user['steam']['nickname'] || null
	};
	this.profile = null;
	this.hive = {
		id: null
	};

	if (this.steam.url) {
		this.hive.id = this.getHiveId();
	}
}

User.prototype.getSteamId = () => {
	if (this.steam.url === null) return null;
	var urlId = this.steam.url.match(/\d*$/);
	if (!urlId || urlId[0].length === 0) return null;
	return steam.convertToText(urlId[0]);
};

User.prototype.getHiveId = () => {
	var steamId = this.steam.id;
	if (!steamId) return null;
	var index = steamId.match(/:0:/) ? 0 : 1;
	var tailId = parseInt(steamId.match(/\d*$/), 10);
	return index === 1 ? (tailId * 2) + 1 : tailId * 2;
};

var allowedAttributes = ["enslo", "division", "skill"];
var allowedAbilities = ["skulk", "lerk", "fade", "gorge", "onos", "commander"];
User.prototype.updateProfile = (data, callback) => {
	let self = this;
	Profile.findOne({userId: self.id}, (error, profile) => {
		if (error) return callback(error);
		allowedAttributes.forEach(function (attr) {
			if (data[attr] !== undefined) profile[attr] = data[attr];
		});
		if (data.abilities) {
			allowedAbilities.forEach(function (attr) {
				let newAbility = data.abilities[attr];
				let abilities = profile.abilities;
				if (newAbility !== undefined) abilities[attr] = newAbility;
			});
		}
		profile.save(function (error, profile) {
			if (error) return callback(error);
			self.profile = profile.toJson();
			return callback(error, profile);
		});
	});
};

User.find = (id, callback) => {
	enslClient.getUserById({
		id: id
	}, (error, response, body) => {
		if (error) return callback(error);
		if (response.statusCode !== 200) return callback(new Error("Unable to auth user against API"));
		let user = new User(body);
		async.parallel([
			// Retrieve or create user profile from local store
			callback => {
				Profile.findOrCreate(user, (error, profile) => {
					if (error) return callback(error);
					user.profile = profile.toJson();
					return callback(null, profile);
				});
			},
			// Retrive Hive Stats
			callback => {
				hiveClient.getUserStats(user, (error, response, body) => {
					if (error || response.statusCode !== 200 || body.id === null) return callback();
					_.assign(user.hive, body);
					return callback(null, body);
				});
			}
		], function (error, result) {
			if (error) return callback(error);
			return callback(null, user);
		})
	});
};

 module.exports = User;
