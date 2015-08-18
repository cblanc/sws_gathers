"use strict";

var path = require("path");
var winston = require("winston");
var config = require("./config.js");

module.exports = app => {
	app.get("/", (request, response, next) => {
		response.render("index.hbs", {
			redirect: config.ensl_url			
		});
	});

	app.get("/redirect", (request, response, next) => {
		response.render("redirect.hbs", {
			redirect: config.ensl_url
		});
	});

	app.get("*", (request, response) => {
		response.status(404).render("404.hbs");
	});

	app.use(function (error, request, response, next) {
		winston.error(error);
		return response.status(500).render("500.hbs");
	});
};