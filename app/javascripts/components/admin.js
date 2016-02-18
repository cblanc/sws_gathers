const React = require("react");
import {MenubarMixin} from "javascripts/components/menubar";

const UserLogin = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	getInitialState() {
		return {
			userId: null
		};
	},

	handleChange(e) {
		const newId = e.target.value || null;
		this.setState({ userId: newId });
	},

	authorizeId(id) {
		this.props.socket.emit("users:authorize", {
			id: id
		});
	},

	handleSubmit(e) {
		e.preventDefault();
		this.authorizeId(this.state.userId);
	},

	render() {
		return (
			<form>
				<div className="input-group signin">
					<input 
						id="btn-input" 
						type="text" 
						className="form-control" 
						vaue={this.state.userId}
						onChange={this.handleChange}
						placeholder="Change user (input ID)" />
					<span className="input-group-btn">
						<input 
							type="submit" 
							className="btn btn-primary" 
							onClick={this.handleSubmit}
							value="Assume ID" />
					</span>
				</div>
			</form>
		);
	}
});

const AdminPanel = exports.AdminPanel = React.createClass({
	mixins: [MenubarMixin],

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	handleGatherReset() {
		this.props.socket.emit("gather:reset");
	},

	render() {
		return (
			<li className={this.componentClass()}>
			  <a href="#" onClick={this.toggleShow}>
			    <i className="fa fa-rebel"></i>
			  </a>
			  <ul className="dropdown-menu">
			    <li className="header">Admin</li>
				  <ul className="news-menu">
				    <h5>Swap Into a Different Account (Only works for admins)</h5>
						<UserLogin socket={this.props.socket} />
						<h5>Gather Options</h5>
						<div>
							<button
								className="btn btn-danger max-width"
								onClick={this.handleGatherReset}>
								Reset Gather</button>
						</div>
				  </ul>
			  </ul>
			</li>
		);
	}
});