"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	userId: { type: Number, required: true },
	skills: {
		lerk: { type: Boolean, default: false },
		fade: { type: Boolean, default: false },
		gorge: { type: Boolean, default: false },
		onos: { type: Boolean, default: false },
		commander: { type: Boolean, default: false }
	}
});

profileSchema.path('userId').index({ unique: true });

module.exports = mongoose.model("Profile", profileSchema);
