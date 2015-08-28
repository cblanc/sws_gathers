"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	userId: { type: Number, required: true },
	abilities: {
		lerk: { type: Boolean, default: false },
		fade: { type: Boolean, default: false },
		gorge: { type: Boolean, default: false },
		onos: { type: Boolean, default: false },
		commander: { type: Boolean, default: false },
		enslo: { type: Number, default: null }
	},
	division: { type: String, default: null }
});

profileSchema.path('userId').index({ unique: true });

module.exports = mongoose.model("Profile", profileSchema);
