"use strict";

var config = {
	port: 80,
	mongo: {
		uri: "" // Set using MONGOLAB_URI
	},
	secret_token: "",
	session_store_name: "_ENSL_session_key_staging",
	ensl_url: "http://www.ensl.org/"
};

module.exports = config;