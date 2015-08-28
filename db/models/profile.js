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
		commander: { type: Boolean, default: false }
	},
	enslo: { type: Number, default: null },
	division: { type: String, default: null }
});

profileSchema.path('userId').index({ unique: true });

profileSchema.static({
	findOrCreate: (user, callback) => {
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
	toJson: () => {
		let output = {};
		output.abilities = this.abilities;
		output.division = this.division;
		return output;
	}
});

module.exports = mongoose.model("Profile", profileSchema);
