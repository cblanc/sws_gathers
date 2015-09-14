"use strict";

class SoundController {
	constructor () {
		if (Howl === undefined) {
			throw new Error("Howl.js required to created sound controller");
		}
		this.gather = {
			music: new Howl({
				urls: ['http://www.ensl.org/sounds/gather-1.mp3']
			}),
			playable: true
		};
		this.minPlayInterval = 300000; // 5 minutes
		this.isMuted = Howler._muted;
		this.volume = Howler._volume;
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

	playGatherMusic () {
		var self = this;
		if (!self.gather.playable) return;
		self.gather.music.play();
		self.gather.playable = false;
		setTimeout(function () {
			self.gather.playable = true;
		}, self.minPlayInterval);
	}
}

var SoundPanel = React.createClass({
	mute() {
		soundController.mute();
		this.forceUpdate();
	},

	unMute() {
		soundController.unMute();
		this.forceUpdate();
	},

	render() {
		if (soundController.isMuted) {
			return (
				<li>
					<a href="#" onClick={this.unMute}>
						Unmute&nbsp;<i className="fa fa-volume-up fa-fw"></i>
					</a>
				</li>
			);
		} else {
			return (
				<li>
					<a href="#" onClick={this.mute}>
						Mute&nbsp;<i className="fa fa-volume-off fa-fw"></i>
					</a>
				</li>
			);
		}
	}
})