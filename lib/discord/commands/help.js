module.exports.run = async (bot, message, args) => {
	let resp = "```NSL Gather Bot Help\n\n";
	if(0 === args.length){
		resp += "Use !help <command> to see more detailed instructions on how to use a certain command\n" +
				"+-------------------+\n";
		bot.commands.forEach((c,i) => {
			resp += `!${c.help.name} - ${c.help.desc}\n`
		});
		resp += "+-------------------+\n```"
				
	} else {
		let cmd = bot.commands.get(args[0]);
		if(cmd) {
			resp += `Help for command: ${cmd.help.name}`;	
		} else {
			resp += `Unknown command: ${args[0]}!\nUse !help to show available commands`;
		}
		

	}
	
	message.channel.send(resp);
}

module.exports.help = {
	name: "help",
	desc: "Shows this message or specific help for a command",
	usage: "!help [command]",
	args: {
		"command": "[optional] specify a command to show usage information for"
	}
}