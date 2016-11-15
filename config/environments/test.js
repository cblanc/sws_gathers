"use strict";

var config = {
	port: 9000,
	mongo: {
		uri: "mongodb://localhost/swsgather_test"
	},
	secret_token: "SUPERSECRETFOO",
	session_store_name: "_ENSL_session_key_staging",
	hive_url: "http://hive.naturalselection2.com",
	hive2_url: "http://hive2.ns2cdt.com",
	ensl_rules_url: "http://www.ensl.org/articles/464",
	ensl_url: "http://staging.ensl.org/",
	steam_bot_link: "http://steamcommunity.com/id/nslgathers"
};

module.exports = config;