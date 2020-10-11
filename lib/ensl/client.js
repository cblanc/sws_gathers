"use strict";

var path = require("path");
var crypto = require("crypto");
var request = require("request");
var logger = require("winston");
var querystring = require('querystring');
var config = require(path.join(__dirname, "../../config/config"));
const SECRET_TOKEN = config.secret_token;
const Marshal = require('marshal');


const MAP_CATEGORY = 45;
const SERVER_CATEGORY = 45;

function EnslClient(options) {
  if (!(this instanceof EnslClient)) {
    return new EnslClient(options);
  }

  this.baseUrl = config.ensl_url;
}

EnslClient.prototype.getUserById = function (options, callback) {
  var id = options.id;
  var url = this.baseUrl + "api/v1/users/" + id;
  return request({
    url: url,
    json: true
  }, callback);
};

EnslClient.prototype.getTeamById = function (options, callback) {
  const id = options.id;
  const url = `${this.baseUrl}api/v1/teams/${id}`;
  return request({
    url: url,
    json: true
  }, callback);
};

EnslClient.prototype.getServers = function (callback) {
  const url = this.baseUrl + "api/v1/servers";
  return request({
    url: url,
    json: true
  }, (error, response, data) => {
    if (error) return callback(error);
    if (response.statusCode !== 200) return callback(new Error("Non-200 status code received"));
    return callback(null, {
      servers: data.servers.filter(function (server) {
        return server.category_id === SERVER_CATEGORY;
      })
    });
  });
};

EnslClient.prototype.getMaps = function (callback) {
  const url = this.baseUrl + "api/v1/maps";
  return request({
    url: url,
    json: true
  }, (error, response, data) => {
    if (error) return callback(error);
    if (response.statusCode !== 200) return callback(new Error("Non-200 status code received"));
    return callback(null, {
      maps: data.maps.filter(map => {
        return map.category_id === MAP_CATEGORY;
      })
    });
  });
};

EnslClient.prototype.getFullAvatarUri = function (url) {
  return this.baseUrl + url.replace(/^\//, "");
};

EnslClient.parseCookies = function (socket) {
  let cookieString = socket.request.headers.cookie;
  if (typeof cookieString !== 'string') return null;
  let cookies = socket.request.headers.cookie.split(";")
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      let values = cookie.split("=");
      let attr = values[0];
      let val = values[1];
      if (attr && val) acc[attr] = val;
      return acc;
    }, {})
  return cookies;
};

EnslClient.decodeSession = function (sessionCookie, callback) {
  if (typeof sessionCookie !== 'string') {
    return callback(new Error("Invalid cookie"), null);
  }

  var session = sessionCookie.split("--");
  if (session.length !== 2) {
    return callback(new Error("Invalid cookie: No signature provided"), null);
  }

  // Separate text and signature
  var text = querystring.unescape(session[0]);
  var signature = session[1];

  // Verify signature
  if (crypto.createHmac("sha1", SECRET_TOKEN).update(text).digest('hex') !== signature) {
    return callback(new Error("Invalid cookie signature"), null);
  }

  let railsSession = new Marshal(text, 'base64').toJSON();

  if (isNaN(railsSession.user)) {
    return callback(new Error("Invalid cookie: User ID not found"), null);
  } else {
    return callback(null, railsSession.user);
  }
};



module.exports = EnslClient;
