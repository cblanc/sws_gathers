"use strict";

// UserStatistics constructor parses Hive 1 and Hive 2 responses into 
// unified statistical interface

// StatAttributes outlines required parameters and how to extract them
// from V1 or V2 api responses. Also provides default value as fallback
const StatAttributes = {
	steamId: {
		v1: "steamId",
		v2: "steamid",
		default: 0
	},
	assists: {
		v1: "assists",
		v2: null,
		default: 0
	},
	deaths: {
		v1: "deaths",
		v2: null,
		default: 0
	},
	kills: {
		v1: "kills",
		v2: null,
		default: 0
	},
	level: {
		v1: "level",
		v2: "level",
		default: 0
	},
	loses: {
		v1: "loses",
		v2: "loses",
		default: 0
	},
	playTime: {
		v1: "playTime",
		v2: "time_played",
		default: 0
	},
	score: {
		v1: "score",
		v2: "score",
		default: 0
	},
	wins: {
		v1: "wins",
		v2: null,
		default: 0
	},
	reinforcedTier: {
		v1: "reinforcedTier",
		v2: "reinforced_tier",
		default: null
	},
	badges: {
		v1: "badges",
		v2: "badges",
		default: []
	},
	skill: {
		v1: "skill",
		v2: "skill",
		default: 0
	}
};

function UserStatisticsWrapper (apiResponse) {
	for (let attr in StatAttributes) {
		let adapter = StatAttributes[attr];
		this[attr] = apiResponse[adapter.v1] || 
			apiResponse[adapter.v2] || 
			adapter.default;
	}
	// New skill type appears to be Number, revert to string for now
	if (typeof this["skill"] === "number") {
		this["skill"] = this["skill"].toString();
	}
}

module.exports = UserStatisticsWrapper;
