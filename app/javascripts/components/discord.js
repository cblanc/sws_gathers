const React = require("react");

const discordDefaults = {
	url: "https://discord.gg/Bvs3KjX",
	alien: {
		channel: "https://discord.gg/UcN724q",
	},
	marine: {
		channel: "https://discord.gg/eGwfHXz",
	}
};

const DiscordButton = exports.DiscordButton = React.createClass({
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
		return discordDefaults
	},

	marineUrl() {
		return discordDefaults.marine.channel;
	},

	alienUrl() {
		return discordDefaults.alien.channel;
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
					<li><a href={this.props.url}>Join Discord channel</a></li>
					<li><a href={this.marineUrl()}>Join Marine channel</a></li>
					<li><a href={this.alienUrl()}>Join Alien channel</a></li>
					<li><p className="let-me-copy">Server: {discordDefaults.url}</p></li>
				</ul>
			);
		}

 		return (
			<li className={componentClass.join(" ")}>
				<a href="#" onClick={this.toggleOpen}>
					<i className="fa fa-microphone"></i><span>Discord</span>
					{this.chevron()}
				</a>
				{dropdown}
			</li>
		);
	}
});

