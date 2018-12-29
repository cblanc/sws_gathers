const React = require("react");
import {CompletedGather} from "javascripts/components/gather";

const ArchivedGathers = exports.ArchivedGathers = React.createClass({
	propTypes: {
		archive: React.PropTypes.array.isRequired,
		maps: React.PropTypes.array.isRequired
	},

	render() {
		let archive = this.props.archive
			.sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			})
			.map((archivedGather, index) => {
				return <CompletedGather 
					key={archivedGather.gather.done.time}
					show={(index === 0) ? true : false}
					gather={archivedGather.gather} 
					maps={this.props.maps} />
			});

		return (
			<div className="panel panel-primary">
				<div className="panel-heading">Archived Gathers</div>
				<div className="panel-body">
					{archive}
				</div>
			</div>
		);
	}
});
