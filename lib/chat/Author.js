"use strict";

// Method which caches a single instance for each author

var Authors = (function () {
	var authors = {};

	return function (author) {
		if (authors[author.id]) {
			return authors[author.id]
		} else {
			return authors[author.id] = author;
		}
	};
})();

module.exports = Authors;