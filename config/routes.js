"use strict";

var path = require("path");
var winston = require("winston");
var config = require("./config.js");
var Gather = require("../lib/gather/gather_singleton");
var cors = require("cors");

module.exports = app => {
	app.use(cors());

	app.get("/", (request, response, next) => {
		response.render("index.hbs", {
			redirect: config.ensl_url,
			bot_url: config.steam_bot_link,
			rules_url: config.ensl_rules_url
		});
	});

	app.get("/redirect", (request, response, next) => {
		response.render("redirect.hbs", {
			redirect: config.ensl_url
		});
	});

	app.get("/gathers/current", (request, response) => {
		let gather = Gather.current;
		response.status(200).json(gather.toJson());
	});

	app.get("/messages", (request, response) => {
		if (request.is("json")) {
			// To Implement
			response.end("")
		} else {
			response.render("messages.hbs");
		}
	});

	app.get("*", (request, response) => {
		response.status(404).render("404.hbs");
	});

	app.use(function (error, request, response, next) {
		winston.error(error);
		return response.status(500).render("500.hbs");
	});
};