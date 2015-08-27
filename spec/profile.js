"use strict";

var helper = require("./helpers/index.js");
var Profile = helper.Profile;
var assert = require("chai").assert;
var async = require("async");
var userCount = 0;

describe("Profile model", () => {
	describe(".create", () => {
		var profile;

		beforeEach(() => {
			profile = {
				userId: ++userCount + Math.floor(Math.random() * 10000)
			};
		});

		it ("creates a new profile",  done => {
			Profile.create(profile, (error, result) => {
				if (error) return done(error);
				assert.equal(result.userId, profile.userId);
				assert.isFalse(result.skills.lerk);
				assert.isFalse(result.skills.fade);
				assert.isFalse(result.skills.onos);
				assert.isFalse(result.skills.commander);
				done();
			});
		});

		it ("requires userId", done => {
			Profile.create({}, (error, result) => {
				assert.isNotNull(error);
				done();
			});
		});

		it ("requires unique userId", done => {
			let userId = profile.userId;
			Profile.create({
				userId: userId
			}, (error, result) => {
				if (error) return done(error);
				Profile.create({
					userId: userId
				}, (error, result) => {
					assert.match(error.message, /E11000/);
					done();
				});
			});
		});
	});
});