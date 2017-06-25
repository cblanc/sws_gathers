"use strict"

// Import the discord.js module
const Discord = require('discord.js');
const fs = require('fs');

function DiscordBot(config) {
	this.client = new Discord.Client();
	this.hook = new Discord.WebhookClient(config.hook_id,config.hook_token);
	this.spamProtection = {
		fillStatus: null,
	};
	this.commands = new Discord.Collection();

	fs.readdir(__dirname + '/commands/', (err,files) => {
		if (err) { console.error(err); }
		let cmdFiles = files.filter(f => { return f.split('.').pop() === 'js'; });
		if (0 >= cmdFiles.length) { console.log('No commands found!'); return; }

		console.log(`Loading ${cmdFiles.length} commands...`);

		cmdFiles.forEach((f,i) => {
			let cmd = require(`./commands/${f}`);
			this.commands.set(cmd.help.name, cmd);
			console.log(`Loaded command #${i+1}: ${cmd.help.name}`);
		});

		console.log('Finished loading commands.');


	});

	this.client.on('ready', () => {
	  	console.log('I am ready!');
	});

	this.client.on('message', (message) => {
		if(!message.content.startsWith('!')) return;
		if(message.author.bot) return;

		let args = message.content.split(' ');
		let command = args[0].substr(1);
		args.shift();

		let cmd = this.commands.get(command);
		if(cmd) cmd.run(this,message,args);

	});



	this.client.login(config.client_token);

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