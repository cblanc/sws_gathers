var GatherPool = require("../../gather/gather_pool");

module.exports.run = async (bot, message, args) => {
	let g = GatherPool.get('classic').current;
	let resp =  "```" + 
				`${g.name}: ${g.gatherers.length}/${g.teamSize * 2}\n\n`;
	if(0 < g.gatherers.length){
		resp += "Players waiting to play:\n" +
				"----------\n"

		g.gatherers.forEach((p,i) => {
			resp += ` ${i + 1}. ${p.user.username}\n`;
		});
	}

	resp += "```";
	message.channel.send(resp);
}

module.exports.help = {
	name: "status",
	desc: "Shows the current status of the gather",
	usage: "!status",
	args: {}
}