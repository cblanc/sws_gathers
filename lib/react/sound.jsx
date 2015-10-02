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
