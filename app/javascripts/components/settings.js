const React = require("react");

const SettingsPanel = React.createClass({
	render() {
		return (
			<div className="modal fade" id="settingsmodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" 
								aria-label="Close">
									<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Settings</h4>
						</div>
						<div className="modal-body">
							<div className="checkbox">
								<label className="checkbox-inline">
									<input type="checkbox" 
										onChange={this.props.toggleUpdateTitle}
										checked={this.props.updateTitle}/> Update Gather Status in Title (Cabooble Mode) - May require refresh
								</label>
							</div>
		        </div>
		        <div className="modal-body">
							<div className="checkbox">
								<label className="checkbox-inline">
									<input type="checkbox" 
										onChange={this.props.toggleEventsPanel}
										checked={this.props.showEventsPanel}/> Show events panel
								</label>
							</div>
		        </div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" 
								data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
