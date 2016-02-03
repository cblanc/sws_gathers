const React = require("react");

const InfoButton = exports.InfoButton = React.createClass({
	getInitialState() {
		return {
			open: false
		};
	},

	toggleOpen(e) {
		e.preventDefault();
		this.setState({ open: !this.state.open });
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
					<li>
						<a href="https://github.com/cblanc/sws_gathers" target="_blank">
							<i className="fa fa-github">&nbsp;</i>&nbsp;Github
						</a>
					</li>
					<li>
						<a href="http://steamcommunity.com/id/nslgathers" target="_blank">
							<i className="fa fa-steam-square">&nbsp;</i>&nbsp;Steam Bot
						</a>
					</li>
					<li>
						<a href="http://www.ensl.org/articles/464" target="_blank">
							<i className="fa fa-legal">&nbsp;</i>&nbsp;Gather Rules
						</a>
					</li>
					<li>
						<a href="/messages" target="_blank">
							<i className="fa fa-comments">&nbsp;</i>&nbsp;Message Archive
						</a>
					</li>
				</ul>
			);
		}

 		return (
			<li className={componentClass.join(" ")}>
				<a href="#" onClick={this.toggleOpen}>
					<i className="fa fa-info-circle"></i><span>Info</span>
					{this.chevron()}
				</a>
				{dropdown}
			</li>
		);
	}
});

