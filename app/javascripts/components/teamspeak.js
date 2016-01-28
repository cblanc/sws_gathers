const React = require("react");

const teamspeakDefaults = {
	url: "ts3server://ensl.org/",
	password: "ns2gather",
	alien: {
		channel: "NS2 Gather/Gather #1/Alien",
		password: "ns2gather"
	},
	marine: {
		channel: "NS2 Gather/Gather #1/Marine",
		password: "ns2gather"
	}
};

const TeamSpeakButton = exports.TeamSpeakButton = React.createClass({
	getInitialState() {
		return {
			open: false
		};
	},

	toggleOpen(e) {
		e.preventDefault();
		this.setState({ open: !this.state.open });
	},
	getDefaultProps() {
		return teamspeakDefaults
	},

	marineUrl() {
		return this.teamSpeakUrl(this.props.marine);
	},

	alienUrl() {
		return this.teamSpeakUrl(this.props.alien);
	},

	teamSpeakUrl(conn) {
		let params = `channel=${encodeURIComponent(conn.channel)}&
			channelpassword=${encodeURIComponent(conn.password)}`;
		return (`${this.props.url}?${params}`);
	},

	chevron() {
		if (this.state.open) {
			return <i className="fa fa-angle-down pull-right"></i>;
		} else {
			return <i className="fa fa-angle-right pull-right"></i>; 
		}
	},

	render() {
		const open = this.state.open;
		let componentClass = ["treeview"];
		let dropdown;
		if (open) {
			componentClass.push("active");
			dropdown = (
				<ul className="treeview-menu menu-open" style={{display: "block"}}>
					<li><a href={this.props.url}>Join Teamspeak Lobby</a></li>
					<li><a href={this.marineUrl()}>Join Marine Teamspeak</a></li>
					<li><a href={this.alienUrl()}>Join Alien Teamspeak</a></li>
					<li><a href="#">Server: {teamspeakDefaults.url}</a></li>
					<li><a href="#">Password: {teamspeakDefaults.password}</a></li>
				</ul>
			);
		}

 		return (
			<li className={componentClass.join(" ")}>
				<a href="#" onClick={this.toggleOpen}>
					<i className="fa fa-microphone"></i><span>Teamspeak</span>
					{this.chevron()}
				</a>
				{dropdown}
			</li>
		);
	}
});

