const React = require("react");

var SnowMachineMenu = React.createClass({
	getInitialState() {
		return {
			snowMachine: null
		}
	},

	componentDidMount() {
		const snowMachine = new SnowMachine();
		snowMachine.start();
		this.setState({ snowMachine: snowMachine });
	},

	toggle() {
		const snowMachine = this.state.snowMachine;
		if (snowMachine.timer) {
			snowMachine.stop();
		} else {
			snowMachine.start();
		}
	},

	render() {
		return (
			<ul className="nav navbar-top-links navbar-right">
			  <li>
					<a href="#" onClick={this.toggle}>
						Snow
					</a>
				</li>
		  </ul>
	  );
	}
});
