var GatherPool = require("../../gather/gather_pool");

module.exports.run = async (bot, message, args) => {
	let g = GatherPool.get('classic').current;
	let resp = `\`\`\`${g.name}: ${g.gatherers.length}/${g.teamSize * 2}\`\`\``;
	message.channel.send(resp);
}

module.exports.help = {
	name: "status",
	desc: "Shows the current status of the gather",
	usage: "!status",
	args: {}
}