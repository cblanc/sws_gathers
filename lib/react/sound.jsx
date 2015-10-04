class SoundController {
	constructor () {
		if (Howl === undefined) {
			throw new Error("Howl.js required to created sound controller");
		}

		this.MINIMUM_PLAY_INTERVAL = 120000;

		this.playGatherMusic = _.throttle(() => {
			this.gather.music.play();
		}, this.MINIMUM_PLAY_INTERVAL);

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


var SoundPanel = React.createClass({
	mute() {
		this.props.soundController.mute();
		this.forceUpdate();
	},

	unMute() {
		this.props.soundController.unMute();
		this.forceUpdate();
	},

	render() {
		let soundController = this.props.soundController;
		if (soundController.isMuted) {
			return (
				<li>
					<a href="#" onClick={this.unMute}>
						Muted&nbsp;<i className="fa fa-volume-off fa-fw"></i>
					</a>
				</li>
			);
		} else {
			return (
				<li>
					<a href="#" onClick={this.mute}>
						Unmuted&nbsp;<i className="fa fa-volume-up fa-fw"></i>
					</a>
				</li>
			);
		}
	}
});
