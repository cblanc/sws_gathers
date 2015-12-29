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
				return (
					<tr key={event._id}>
						<td className="col-xs-2">{this.getTime(event.createdAt)}</td>
						<td className="col-xs-10">{event.description}</td>
					</tr>
				);
			});
		} else {
			events = <tr><td>Listening for new events...</td></tr>
		}

		return (
			<div className="panel panel-primary">
				<div className="panel-heading">
					Recent Events
				</div>
				<table className="table table-condensed">
					<tbody>
						{events}
					</tbody>
				</table>
			</div>
		);
	}
});
