"use strict";

var helper = require("./helpers/index.js");
var User = helper.User;
var assert = require("chai").assert;
var async = require("async");
var userCount = 0;

describe("User", () => {
	var user, userAttributes;

	before(() => {
		userCount++;
		userAttributes = {
			id: userCount,
			username: "FearLess90",
			country: "CA",
			time_zone: "Eastern Time (US & Canada)",
			avatar: "/images/icons/" + userCount + ".png",
			admin: false,
			steam: {
				url: "http://steamcommunity.com/profiles/76561198076460617",
				nickname: "FearLess90"
			},
			bans: {
				gather: false,
				mute: false,
				site: false
			},
			team: {
			id: 622,
			name: "National Gamers"
			}
		}
	});

	describe("#getSteamId", () => {
		beforeEach(() => {
			user = new User(userAttributes);
		});
		it ("returns steamid", () => {
			assert.equal(user.getSteamId(), "STEAM_0:1:58097444");
		});
		it ("returns null if no steamid", () => {
			user.steam.url = null;
			assert.isNull(user.getSteamId());
		});
	});

	describe("#getHiveId", () => {
		beforeEach(() => {
			user = new User(userAttributes);
		});
		it ("returns hive id", () => {
			console.log(user.getHiveId());
		});
	});
});