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
		
		let gatherMusic;
		if (storageAvailable("localStorage")) {
			let volume = localStorage.getItem("gatherVolume");
			if (volume !== undefined) Howler.volume(volume);
			gatherMusic = localStorage.getItem("gatherMusic");
		}

		this.tunes = {
			"classic": {
				description: "Classic",
				url: 'http://www.ensl.org/files/audio/gather-1.mp3'
			},
			"nights": {
				description: "Nights",
				url: 'http://www.ensl.org/files/audio/nights.mp3'
			},
			"america": {
				description: "Infamous",
				url: 'http://www.ensl.org/files/audio/america.mp3'
			},
			"skyice": {
				description: "Skyice",
				url: 'http://www.ensl.org/files/audio/skyice.mp3'
			},
			"robbie": {
				description: "Robbie",
				url: 'http://www.ensl.org/files/audio/robbie.mp3'
			},
			"justwannahavefun": {
				description: "Gorges just want to have fun",
				url: 'http://www.ensl.org/files/audio/justwannahavefun.mp3'
			},
			"eyeofthegorgie": {
				description: "Eye of the Gorgie",
				url: 'http://www.ensl.org/files/audio/eyeofthegorgie.mp3'
			},
			"boondock": {
				description: "Boondock Marines",
				url: 'http://www.ensl.org/files/audio/boondock.mp3'
			},
		}

		this.setupGatherMusic(gatherMusic);
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

	defaultGatherMusic() {
		return "classic";
	}

	setupGatherMusic (musicName) {
		let self = this;
		let gatherMusic = self.tunes[musicName];

		if (!gatherMusic) {
			// Default to classic
			musicName = this.defaultGatherMusic();
			gatherMusic = self.tunes[musicName]; 
		}

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

var MusicSelector = React.createClass({
	getInitialState() {
		return {
			music: this.selectedMusic()
		}
	},

	selectedMusic() {
		if (storageAvailable("localStorage")) {
			return localStorage.getItem("gatherMusic") 
				|| this.props.soundController.defaultGatherMusic();
		} else {
			return this.props.soundController.defaultGatherMusic(); 
		}
	},

	setMusic(event) {
		let name = event.target.value;
		let soundController = this.props.soundController;
		let selectedTune = soundController.tunes[name];
		if (selectedTune === undefined) return;
		this.setState({ music: name });
		soundController.setupGatherMusic(name);
		if (storageAvailable("localStorage")) {
			localStorage.setItem("gatherMusic", name);
		}
	},

	render() {
		let soundController = this.props.soundController;
		let tunes = [];
		for (var attr in soundController.tunes) {
			let o = soundController.tunes[attr];
			o.id = attr;
			tunes.push(o);
		}
		let options = tunes.map(tune => {
			return <option key={tune.id} value={tune.id}>{tune.description}</option>;
		});
		return (
			<div className="form-group music-select">
				<label>Music</label>
				<select
					className="form-control"
					defaultValue={this.state.music}
					onChange={this.setMusic}
					value={this.state.music}>
					{options}
				</select>
			</div>
		);
	}
})

var SoundPanel = React.createClass({
	componentDidMount() {
		let soundController = this.props.soundController;
		let scale = 10;

		$('a#sound-dropdown').on('click', function (event) {
			$(this).parent().toggleClass('open');
		});

		$("#volume-slide").slider({
			min: 0,
			max: scale,
			step: 1
		}).on("slideStop", ({value}) => {
			soundController.setVolume(value / scale);
		}).slider('setValue', soundController.getVolume() * scale);
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
				<a className="dropdown-toggle" href="#" id="sound-dropdown">
					Sound &nbsp;{mutedIcon}&nbsp;<i className="fa fa-caret-down"></i>
				</a>
				<ul className="dropdown-menu" id="sound-dropdown">
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
					<hr />
					<li>
						<div className="volume-slide">
							<label>Volume</label>
							<div id="volume-slide"></div>
						</div>
					</li>
					<li>
						<MusicSelector soundController={soundController} />
					</li>
				</ul>
			</li>
	  </ul>;
	}
});
