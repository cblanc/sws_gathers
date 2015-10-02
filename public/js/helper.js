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

class SoundController {
	constructor (options) {
		if (Howl === undefined) {
			throw new Error("Howl.js required to created sound controller");
		}

		this.MINIMUM_PLAY_INTERVAL = 120000;

		this.playGatherMusic = _.throttle(() => {
			this.gather.music.play();
		}, this.MINIMUM_PLAY_INTERVAL);

		if (options && options.socket) {
			socket.on("notification", data => {
				if (data && data.sound === "gather_starting") {
					this.playGatherMusic();
				}
			});
		}

		this.isMuted = Howler._muted;

		this.volume = Howler._volume;

		this.tunes = {
			"classic": {
				description: "Classic",
				url: 'http://www.ensl.org/sounds/gather-1.mp3'
			},
			"eyeofthegorgie": {
				description: "Eye of the Gorgie",
				url: 'http://www.ensl.org/files/audio/eyeofthegorgie.mp3'
			}
		}

		this.setupGatherMusic("classic");
	}

	volume(val) {
		if (typeof val === 'number' && Math.abs(val) <= 1) {
			this.volume = val;
			return Howler.volume(val)
		}
	}

	mute() {
		this.isMuted = true;
		return Howler.mute();
	}

	unMute() {
		this.isMuted = false;
		return Howler.unmute();
	}

	play(music) {
		if (this.gather && this.gather.music) return this.gather.music.play();
	}

	stop(music) {
		if (this.gather && this.gather.music) return this.gather.music.stop();
	}

	setupGatherMusic (musicName) {
		let self = this;
		let gatherMusic = this.tunes[musicName];

		if (!gatherMusic) return;
		if (self.gather && self.gather.name === musicName) return;

		// Stop if already playing
		if (self.gather && self.gather.music) {
			self.gather.music.stop();
		}

		let tune = self.tunes[musicName];
		self.gather = {
			name: musicName,
			description: tune.description,
			url: tune.url,
			music: new Howl({
				urls: [tune.url]
			})
		};
	}
}
