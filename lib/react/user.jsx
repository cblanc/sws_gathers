"use strict";

var UserCounter = React.createClass({
	render: function () {
		return (
			<li>
				<a href="#">
					<i className="fa fa-users fa-fw"></i> Online 
					<span className="badge add-left"> {this.props.count} </span>
				</a>
			</li>
		);
	}
});

var UserLogin = React.createClass({
	authorizeId: function (id) {
		id = parseInt(id, 10);
		socket.emit("users:authorize", {
			id: id
		});
		setTimeout(function () {
			socket.emit("gather:refresh");
		}, 5000);
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var id = React.findDOMNode(this.refs.authorize_id).value.trim();
		if (!id) return;
		React.findDOMNode(this.refs.authorize_id).value = '';
		this.authorizeId(id);
		return;
	},
	render: function () {
		return (
			<form onSubmit={this.handleSubmit} >
				<div className="input-group signin">
					<input 
						id="btn-input" 
						type="text" 
						className="form-control" 
						ref="authorize_id"
						placeholder="Choose an ID..." />
					<span className="input-group-btn">
						<input 
							type="submit" 
							className="btn btn-primary" 
							id="btn-chat" 
							value="Login" />
					</span>
				</div>
				<div className="signin">
				<p className="text-center"><small>Just a temporary measure until genuine authentication is implemented</small></p>
				</div>
			</form>
		);
	}
})

var UserMenu = React.createClass({
	getDefaultProps: function () {
		return {
			count: 0,
			users: []
		};
	},
	componentDidMount: function () {
		socket.on('users:update', this.updateUsers);
	},
	updateUsers: function (data) {
		this.setProps({
			count: data.count,
			users: data.users
		});
	},
	render: function () {
		var users = this.props.users.map(function (user) {
			return (
				<li key={user.id}><a href="#">{user.username}</a></li>
			);
		});
		return (
			<ul className="nav" id="side-menu">
				<UserCounter {...this.props} />
				{users}
				<li><br /><UserLogin /><br /></li>
			</ul>
		);
	}
});

var AdminPanel = React.createClass({
	handleGatherReset: function () {
		socket.emit("gather:reset");
	},
	render: function () {
		return (
			<ul className="nav" id="admin-menu">
				<li>
					<div className="admin-panel">
						<h5>Admin</h5>
						<button
							className="btn btn-danger"
							onClick={this.handleGatherReset}>
							Reset Gather</button>
						<p className="text-center"><small>Only responds for admins on staging.ensl.org</small></p>
					</div>
				</li>
			</ul>
		)
	}
});

var CurrentUser = React.createClass({
	componentDidMount: function () {
		var self = this;
		socket.on("users:update", function (data) {
			self.setProps({
				user: data.currentUser
			});
		});
		socket.emit("users:refresh", {});
	},
	render: function () {
		if (this.props.user) {
			return (
				<a href="#">{this.props.user.username} &nbsp;<img src={this.props.user.avatar}
					alt="User Avatar" 
					height="20"
					width="20" /></a>
			);
		} else {
			return false;
		}
	}
});
