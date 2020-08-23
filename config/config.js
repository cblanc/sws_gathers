"use strict";

const env = (process.env.NODE_ENV || "development").toLowerCase().trimRight();
const isTest = env === "test";

const fs = require("fs");
const path = require("path");

const baseConfigFilePath = path.join(__dirname, path.join("environments", env + ".js"));

const baseConfig = require(baseConfigFilePath);
baseConfig.steamBot = {};
baseConfig.discordBot = {};

if (!isTest) {
	if (process.env.PORT) {
		baseConfig.port = parseInt(process.env.PORT, 10);
	}

	if (process.env.MONGOLAB_URI) {
		baseConfig.mongo.uri = process.env.MONGOLAB_URI;
	}

	if (process.env.RAILS_SECRET) {
		baseConfig.secret_token = process.env.RAILS_SECRET;
	}

	if (process.env.GATHER_STEAM_ACCOUNT) {
		baseConfig.steamBot.account_name = process.env.GATHER_STEAM_ACCOUNT;
	}

	if (process.env.GATHER_STEAM_PASSWORD) {
		baseConfig.steamBot.password = process.env.GATHER_STEAM_PASSWORD;
	}

	if (process.env.GATHER_DISCORD_HOOK_ID) {
		baseConfig.discordBot.hook_id = process.env.GATHER_DISCORD_HOOK_ID;
	}

	if (process.env.GATHER_DISCORD_HOOK_TOKEN) {
		baseConfig.discordBot.hook_token =  process.env.GATHER_DISCORD_HOOK_TOKEN;
	}

}

module.exports = baseConfig;
