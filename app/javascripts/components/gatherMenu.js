const React = require("react");

const GatherMenu = exports.GatherMenu = React.createClass({
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
					<li><a href="#" onClick={this.changeGather}>Public Gather</a></li>
				</ul>
			);
		}

 		return (
			<li className={componentClass.join(" ")}>
				<a href="#" onClick={this.toggleOpen}>
					<i className="fa fa-play-circle"></i><span>Gathers</span>
					{this.chevron()}
				</a>
				{dropdown}
			</li>
		);
	}
});

