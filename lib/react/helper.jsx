"use strict";

var rankVotes = function (votes, candidates) {
	var initial = candidates.reduce(function (acc, candidate) {
		acc[candidate.id] = 0;
		return acc;
	}, {});

	var scores = votes.reduce(function (acc, id) {
		if (acc[id] !== undefined) {
			acc[id]++;
		}
		return acc;
	}, initial);

	var rank = [];

	for (var id in scores) {
		if (scores.hasOwnProperty(id)) {
			rank.push({
				id: parseInt(id, 10),
				count: scores[id]
			});
		}
	}

	return rank.sort(function (a, b) {
		return b.count - a.count;
	}).map(function (tally) {
		return tally.id
	}).map(function (id) {
		return candidates.reduce(function (acc, candidate) {
			if (candidate.id === id) return candidate;
			return acc;
		});
	});
};

var enslUrl = (gatherer) => {
	return `http://www.ensl.org/users/${gatherer.id}`
};

var hiveUrl = (gatherer) => {
	let hiveId = gatherer.user.hive.id;
	if (hiveId) {
		return `http://hive.naturalselection2.com/profile/${hiveId}`
	} else {
		return null;
	}
};

var modalId = (user) => {
	return `user-modal-${user.id}`
};