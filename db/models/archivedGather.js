"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var archivedGatherSchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	gather: { type: Schema.Types.Mixed, required: true } 
});

archivedGatherSchema.index({ createdAt: -1 });

archivedGatherSchema.static({
	recent: function (callback) {
		this
			.where({})
			.sort({createdAt: -1})
			.limit(5)
			.exec(callback);
	}
});

module.exports = mongoose.model("ArchivedGather", archivedGatherSchema);
