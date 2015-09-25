"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema({
	userId: { type: Number, required: true },
	abilities: {
		skulk: { type: Boolean, default: true },
		lerk: { type: Boolean, default: false },
		fade: { type: Boolean, default: false },
		gorge: { type: Boolean, default: false },
		onos: { type: Boolean, default: false },
		commander: { type: Boolean, default: false }
	},
	enslo: { type: Number, default: null },
	division: { type: String, default: null },
	skill: { type: String, default: null },
	gatherMusic: { type: String, default: null }
});

profileSchema.path('userId').index({ unique: true });

profileSchema.static({
	findOrCreate: function (user, callback) {
		if (!user || typeof user.id !== 'number') return callback(new Error("Invalid user"));
		let self = this;
		self.findOne({userId: user.id}, (error, profile) => {
			if (error) return callback(error);
			if (profile) return callback(null, profile);
			self.create({userId: user.id}, (error, result) => {
				if (error) return callback(error);
				return callback(null, result);
			});
		});
	}
});

profileSchema.method({
	toJson: function () {
		let output = {};
		output.abilities = this.abilities;
		output.skill = this.skill;
		return output;
	}
});

module.exports = mongoose.model("Profile", profileSchema);
