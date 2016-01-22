const $ = require("jquery");
const React = require("react");

const Events = React.createClass({
	propTypes: {
		events: React.PropTypes.array.isRequired
	},

	getTime(timeString) {
		return (new Date(timeString)).toTimeString().match(/^[\d:]*/)[0];
	},

	render() {
		let events;
		if (this.props.events.length) {
			events = this.props.events.map(event => {
				return `${this.getTime(event.createdAt)} ${event.description}`;
			}).join("\n");
		} else {
			events = <tr><td>Listening for new events...</td></tr>
		}

		return (
			<pre className="events-panel">
				{events}
			</pre>
		);
	}
});

module.exports = Events;