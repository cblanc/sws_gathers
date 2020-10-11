"use strict";

var fs = require("fs");
var path = require("path");
var morgan = require("morgan");
var express = require("express");
var winston = require("winston");
var config = require("./config.js");
var favicon = require("serve-favicon");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var env = process.env.NODE_ENV || "development";
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")));

module.exports = app => {
  app.use((req, res, next) => {
    res.setHeader('X-GNU', 'Michael J Blanchard');
    next();
  });
  // Enforce HTTPS in production
  if (env === 'production') {
    app.use((req, res, next) => {
      res.setHeader('Strict-Transport-Security', 'max-age=2592000; includeSubdomains'); // Enforce usage of HTTPS; max-age = 30 days
      next();
    });
  }
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(cookieParser());
  app.use(favicon(path.join(__dirname, '../public/favicon.ico')));

  // // Use winston on production
  // var log;
  // if (env !== 'development') {
  //   log = {
  //     stream: {
  //       write: (message, encoding) => {
  //         winston.info(message);
  //       }
  //     }
  //   };
  // } else {
  //   log = 'dev';
  // }

  // if (env !== 'test') app.use(morgan(log));

  var hbs = exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  });

  app.engine('.hbs', hbs);
  app.set('view engine', '.hbs');
};
