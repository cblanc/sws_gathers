"use strict"

// Import the discord.js module
const Discord = require('discord.js');

function DiscordBot(config) {
	this.hook = new Discord.WebhookClient(config.hook_id,config.hook_token);
	this.spamProtection = {
		fillStatus: null,
	};

}

DiscordBot.prototype.notifyChannel = function(message) {
	this.hook.send(message);
};

var bot;

module.exports = (config) => {
	if (bot) return bot;
	if (!config) throw new Error("No credentials provided for Discord Gather Bot");
	bot = new DiscordBot(config);
	return bot;
};