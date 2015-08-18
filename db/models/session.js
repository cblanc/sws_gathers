"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');

var keyGenerator = () => {
	return crypto.randomBytes(20).toString('hex');
};

var sessionSchema = new Schema({
	userId: { type: Number, required: true },
	key: { type: String, required: true, default: keyGenerator }
});

sessionSchema.index({ userId: 1 });

module.exports = mongoose.model("Session", sessionSchema);
