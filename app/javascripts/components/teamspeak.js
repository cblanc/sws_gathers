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

var TeamSpeakButton = exports.TeamSpeakButton = React.createClass({
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
	render() {
		return (
			<ul className="nav navbar-top-links navbar-right">
			  <li className="dropdown">
					<a className="dropdown-toggle" data-toggle="dropdown" href="#">
						Teamspeak &nbsp;<i className="fa fa-caret-down"></i>
					</a>
					<ul className="dropdown-menu">
						<li><a href={this.props.url}>Join Teamspeak Lobby</a></li>
						<li><a href={this.marineUrl()}>Join Marine Teamspeak</a></li>
						<li><a href={this.alienUrl()}>Join Alien Teamspeak</a></li>
						<li role="separator" className="divider"></li>
						<li><a href="#" data-toggle="modal" data-target="#teamspeakmodal">Teamspeak Details</a></li>
					</ul>
				</li>
		  </ul>
		);
	}
});

var TeamSpeakModal = exports.TeamSpeakModal = React.createClass({
	getDefaultProps() {
		return teamspeakDefaults;
	},

	render() {
		return <div className="modal fade text-left" id="teamspeakmodal">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" 
							className="close" 
							data-dismiss="modal" 
							aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 className="modal-title">Teamspeak Server Information</h4>
					</div>
					<div className="modal-body">
						<dl className="dl-horizontal">
							<dt>Server</dt>
							<dd>{this.props.url}</dd>
							<dt>Password</dt>
							<dd>{this.props.password}</dd>
							<dt>Marine Channel</dt>
							<dd>{this.props.marine.channel}</dd>
							<dt>Alien Channel</dt>
							<dd>{this.props.alien.channel}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	}
});
