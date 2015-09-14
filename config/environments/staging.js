"use strict";

var config = {
	port: 80,
	mongo: {
		uri: "" // Set using MONGOLAB_URI
	},
	secret_token: "",
	session_store_name: "_ENSL_session_key_staging",
	hive_url: "http://hive.naturalselection2.com/",
	ensl_url: "http://staging.ensl.org/",
	steam_bot_link: "http://steamcommunity.com/id/nslgathers"
};

module.exports = config;