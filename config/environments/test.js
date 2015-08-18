"use strict";

var config = {
	port: 9000,
	mongo: {
		uri: "mongodb://localhost/swsgather_test"
	},
	secret_token: "SUPERSECRETFOO",
	session_store_name: "_ENSL_session_key_staging",
	ensl_url: "http://staging.ensl.org/"
};

module.exports = config;