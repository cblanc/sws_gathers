"use strict";

var config = {
	port: 8000,
	mongo: {
		uri: "mongodb://localhost/swsgather_development"
	},
	secret_token: "",
	session_store_name: "_ENSL_session_key_staging",
	ensl_url: "http://staging.ensl.org/"
};

module.exports = config;