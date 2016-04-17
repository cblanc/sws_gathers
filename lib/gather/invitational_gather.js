"use strict";

const winston = require("winston");
const env = process.env.NODE_ENV || "development";
const client = require("../ensl/client")();
const REFRESH_INTERVAL = 1000 * 60; // Check every minute
const invitationalTeamId = env === "production" ? 949 : 866;

function InvitationalGather () {

}

InvitationalGather.list = [];

InvitationalGather.updateList = function () {
	client.getTeamById({
		id: invitationalTeamId
	}, (error, result) => {
		if (error) {
			winston.error("Unable to download team list")
			winston.error(error);
			return;
		};
		InvitationalGather.list = result.body.members;
	});
};

InvitationalGather.updateList();

setInterval(InvitationalGather.updateList, REFRESH_INTERVAL);

module.exports = InvitationalGather;
