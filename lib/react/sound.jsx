function storageAvailable(type) {
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
}

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

		if (storageAvailable("localStorage")) {
			let volume = localStorage.getItem("gatherVolume");
			if (volume !== undefined) Howler.volume(volume);
		}

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

	mute() {
		this.isMuted = true;
		return Howler.mute();
	}

	unMute() {
		this.isMuted = false;
		return Howler.unmute();
	}

	getVolume() {
		return Howler.volume();
	}

	setVolume(val) {
		if (val === undefined || 
				typeof val !== 'number' || 
				Math.abs(val) > 1) return;
		if (storageAvailable("localStorage")) {
			localStorage.setItem("gatherVolume", val);
		}
		return Howler.volume(val);
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
	componentDidMount() {
		let soundController = this.props.soundController;
		let scale = 10;
		$("#volume-slide").slider({
			min: 0,
			max: scale,
			step: 1
		}).on("slideStop", ({value}) => {
			soundController.setVolume(value / scale);
		}).slider('setValue', soundController.getVolume() * scale);

		console.log(soundController.getVolume());
	},

	mute() {
		this.props.soundController.mute();
		this.forceUpdate();
	},

	unMute() {
		this.props.soundController.unMute();
		this.forceUpdate();
	},

	play() {
		this.props.soundController.play();
	},

	stop() {
		this.props.soundController.stop();
	},

	render() {
		let soundController = this.props.soundController;
		let mutedIcon, mutedButton;
		if (soundController.isMuted) {
			mutedIcon = <i className="fa fa-volume-off fa-fw"></i>;
			mutedButton = <li>
				<a href="#" onClick={this.unMute}>
					{mutedIcon}&nbsp;Muted
				</a>
			</li>;
		} else {
			mutedIcon = <i className="fa fa-volume-up fa-fw"></i>;
			mutedButton = <li>
				<a href="#" onClick={this.mute}>
					{mutedIcon}&nbsp;Unmuted
				</a>
			</li>;
		}
		return <ul className="nav navbar-top-links navbar-right">
		  <li className="dropdown">
				<a className="dropdown-toggle" data-toggle="dropdown" href="#">
					Sound &nbsp;{mutedIcon}&nbsp;<i className="fa fa-caret-down"></i>
				</a>
				<ul className="dropdown-menu">
					{mutedButton}
					<li>
						<a href='#' onClick={this.play}>
							<i className="fa fa-play"></i>&nbsp;Play
						</a>
					</li>
					<li>
						<a href='#' onClick={this.stop}>
							<i className="fa fa-stop"></i>&nbsp;Stop
						</a>
					</li>
					<li>
						<div className="volume-slide">
							<div id="volume-slide"></div>
						</div>
					</li>
				</ul>
			</li>
	  </ul>;
	}
});
