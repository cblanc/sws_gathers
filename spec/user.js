"use strict";

var helper = require("./helpers/index.js");
var User = helper.User;
var assert = require("chai").assert;
var Profile = helper.Profile;
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

	describe("#updateProfile", () => {
		var profile, user;

		beforeEach(done => {
			user = helper.createUser();
			Profile.create({
				userId: user.id
			}, (error, result) => {
				if (error) return done(error);
				profile = result;
				done();
			});
		});

		after(done => helper.clearDb(done));	

		it ("updates profile", done => {
			var attrs = {
				enslo: 88,
				division: "Foo",
				skill: "Bar",
				gatherMusic: "Baz"
			};
			user.updateProfile(attrs, (error, profile) => {
				if (error) return done(error);
				assert.equal(profile.enslo, attrs.enslo);
				assert.equal(profile.division, attrs.division);
				assert.equal(profile.skill, attrs.skill);
				assert.equal(profile.gatherMusic, attrs.gatherMusic);
				done();
			});
		});

		it ("updates abilities", done => {
			var attrs = {
				abilities: {
					"skulk": true,
					"lerk": true,
					"fade": true,
					"gorge": true,
					"onos": true,
					"commander": true
				}
			};
			user.updateProfile(attrs, (error, profile) => {
				if (error) return done(error);
				for (let attr in attrs.abilities) {
					assert.isTrue(profile.abilities[attr])
				}
				done();
			});
		});

		it ("does not update userId", done => {
			user.updateProfile({
				userId: 80808080
			}, (error, result) => {
				if (error) return done(error);
				assert.equal(result.userId, user.id);
				done();
			});
		});

		it ("does not update _id", done => {
			user.updateProfile({
				_id: "FOOOO"
			}, (error, result) => {
				if (error) return done(error);
				assert.equal(result._id.toString(), profile._id.toString());
				done();
			});
		});
	});
});
