"use strict";

var _ = require("lodash");
var steam = require("steam");
var winston = require("winston");
var password = process.env.GATHER_STEAM_PASSWORD;
var account_name = process.env.GATHER_STEAM_ACCOUNT;
var Gather = require("../gather/gather_singleton");

function SteamBot(config) {
	let self = this;
	self.client = new steam.SteamClient();
	self.user = new steam.SteamUser(self.client);
	self.friends = new steam.SteamFriends(self.client);

	let addToGather = (steamId, message) => {
		self.friends.sendMessage(steamId, "Added you to the gather");
	};

	let removeFromGather = (steamId, message) => {
		self.friends.sendMessage(steamId, "Removed your from gather");
	};

	let returnGatherInfo = (steamId, _) => {
		let gather = Gather.current;
		let state = gather.current.toUpperCase();
		let players = gather.gatherers.length;
		let message = "Current Gather: " + state + " (" + players + "/12 Players)";
		self.friends.sendMessage(steamId, message);
	};

	let showHelp = (steamId, message) => {
		self.friends.sendMessage(steamId, "Bot Commands:");
		self.friends.sendMessage(steamId, "!info - Get information on current gather");
		// self.friends.sendMessage(steamId, "!join - Join current gather");
		// self.friends.sendMessage(steamId, "!leave - Leave current gather");
	};

	let confirmFriend = steamId => {
		self.friends.addFriend(steamId);
		self.friends.sendMessage(steamId, "You're now registered on the ENSL Gather Bot. Type !help to find out how to interact");
	};

	self.client.on("connected", () => {
		self.user.logOn(config);
	});

	self.client.on("error", error => {
		winston.error(error);
		winston.info("Reconnecting steam bot in 5 seconds");
		setTimeout(() => {
			self.client.connect();
		}, 5000);
	});

	self.client.on('logOnResponse', logonResp => {
	  if (logonResp.eresult == steam.EResult.OK) {
	  	winston.info("Logged onto Steam");

	  	// Go online
	    self.friends.setPersonaState(steam.EPersonaState.Online);

	    // Accept backlog of friend request
	    for (let friend in self.friends.friends) {
	    	if (self.friends.friends[friend] < 3) confirmFriend(friend);
			};
	  }
	});

	self.friends.on('friend', (steamId, relationship) => {
		if (steam.EFriendRelationship.RequestRecipient === relationship) {
			confirmFriend(steamId);
		}
	});

	self.friends.on('friendMsg', (steamId, message, EChatEntryType) => {
		winston.info(message);
		if (message.match(/^!help/i)) return showHelp(steamId, message);
		// if (message.match(/^!join/i)) return addToGather(steamId, message);
		// if (message.match(/^!leave/i)) return removeFromGather(steamId, message);
		if (message.match(/^!info/i)) return returnGatherInfo(steamId, message);
	});

	self.client.connect();
}

var bot;

module.exports = config => {
	if (bot) return bot;
	if (!config) throw new Error("No credentials provided for Steam Gather Bot");
	bot = new SteamBot(config);
	return bot;
};
