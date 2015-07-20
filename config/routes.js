"use strict";

var config = require("./config.js");

module.exports = function (app) {
	app.get("/", function (request, response) {
		response.render("index.hbs");
	});

	app.get("*", function (request, response) {
		response.status(404).render("404.hbs");
	});
};