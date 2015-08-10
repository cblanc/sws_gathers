"use strict";

var config = require("./config.js");

module.exports = app => {
	app.get("/", (request, response) => {
		response.render("index.hbs");
	});

	app.get("*", (request, response) => {
		response.status(404).render("404.hbs");
	});
};