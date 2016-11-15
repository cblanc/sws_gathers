"use strict";

var config = {
	port: 80,
	mongo: {
		uri: "" // Set using MONGOLAB_URI
	},
	secret_token: "",
	session_store_name: "_ENSL_session_key",
	hive_url: "http://hive.naturalselection2.com",
	hive2_url: "http://hive2.ns2cdt.com",
	ensl_url: "http://www.ensl.org/",
	ensl_rules_url: "http://www.ensl.org/articles/464",
	steam_bot_link: "http://steamcommunity.com/id/nslgathers"
};

module.exports = config;