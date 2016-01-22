// Accepts an array of IDs voted
// 1. Creates an array of tally objects, 
//		with ID as prop and vote count as val { 12: 0 }
// 2. Increments ID vote tally for every vote
// 3. Sorts 

const rankVotes = exports.rankVotes = function (votes, candidates) {
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
		if (b.count === a.count) {
			return b.id - a.id;
		} else {
			return b.count - a.count;
		}
	}).map(function (tally) {
		return tally.id
	}).map(function (id) {
		return candidates.reduce(function (acc, candidate) {
			if (candidate.id === id) return candidate;
			return acc;
		});
	});
};

const enslUrl = exports.enslUrl = (gatherer) => {
	return `http://www.ensl.org/users/${gatherer.id}`
};

const hiveUrl = exports.hiveUrl = (gatherer) => {
	const hiveId = gatherer.user.hive.id;
	if (hiveId) {
		return `http://hive.naturalselection2.com/profile/${hiveId}`;
	} else {
		return null;
	}
};

const modalId = exports.modalId = (user) => {
	return `user-modal-${user.id}`;
};

const storageAvailable = exports.storageAvailable = (type) => {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
};
