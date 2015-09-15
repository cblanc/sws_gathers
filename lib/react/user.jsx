"use strict";

var UserLogin = React.createClass({
	authorizeId(id) {
		socket.emit("users:authorize", {
			id: parseInt(id, 10)
		});
		setTimeout(function () {
			socket.emit("gather:refresh");
		}, 1000);
	},

	handleSubmit(e) {
		e.preventDefault();
		let id = React.findDOMNode(this.refs.authorize_id).value.trim();
		if (!id) return;
		React.findDOMNode(this.refs.authorize_id).value = '';
		this.authorizeId(id);
	},

	render() {
		return (
			<form onSubmit={this.handleSubmit} >
				<div className="input-group signin">
					<input 
						id="btn-input" 
						type="text" 
						className="form-control" 
						ref="authorize_id"
						placeholder="Change user" />
					<span className="input-group-btn">
						<input 
							type="submit" 
							className="btn btn-primary" 
							id="btn-chat" 
							value="Assume ID" />
					</span>
				</div>
			</form>
		);
	}
})

var UserMenu = React.createClass({
	getDefaultProps() {
		return {
			users: []
		};
	},

	componentDidMount() {
		let self = this;
		socket.on('users:update', data => self.setProps({users: data.users}));
	},

	render() {
		let users = this.props.users.map(user => {
			return (
				<li key={user.id}
					className="list-group-item">
						<a href="#">{user.username}</a>
				</li>
			);
		});
		return (
			<div>
				<div className="panel panel-default add-bottom">
					<div className="panel-heading">
						<i className="fa fa-users fa-fw"></i>  Online
						<span className="badge pull-right">{this.props.users.length}</span>
					</div>
				</div>
				<ul className="list-group" id="users-list">
					{users}
				</ul>
			</div>
		);
	}
});

var AdminPanel = React.createClass({
	handleGatherReset() {
		socket.emit("gather:reset");
	},

	render() {
		return (
		<div>
			<h5>Swap Into a Different Account</h5>
			<UserLogin />
			<h5>Gather Options</h5>
			<div>
				<button
					className="btn btn-danger max-width"
					onClick={this.handleGatherReset}>
					Reset Gather</button>
			</div>
		</div>
		);
	}
});

var ProfileModal = React.createClass({
	componentDidMount() {
		let self = this;
		socket.on("users:update", data => self.setProps({user: data.currentUser}));
	},
	handleUserUpdate(e) {
		e.preventDefault();
		let abilities = {
			skulk: React.findDOMNode(this.refs.skulk).checked,
			lerk: React.findDOMNode(this.refs.lerk).checked,
			gorge: React.findDOMNode(this.refs.gorge).checked,
			fade: React.findDOMNode(this.refs.fade).checked,
			onos: React.findDOMNode(this.refs.onos).checked,
			commander: React.findDOMNode(this.refs.commander).checked
		};
		let skill = React.findDOMNode(this.refs.playerskill).value;
		socket.emit("users:update:profile", {
			id: this.props.user.id,
			profile: {
				abilities: abilities,
				skill: skill
			}
		});
	},
	render() {
		if (!this.props.user) return false;
		let abilities = this.props.user.profile.abilities;
		let abilitiesForm = [];
		for (let lifeform in abilities) {
			abilitiesForm.push(
				<div key={lifeform} className="checkbox">
					<label className="checkbox-inline">
						<input type="checkbox" 
							ref={lifeform}
							defaultChecked={abilities[lifeform]}/> {_.capitalize(lifeform)}
					</label>
				</div>
			);
		}

		let division = this.props.user.profile.skill;
		let skillLevels = ["Low Skill", "Medium Skill", "High Skill"].map(skill => {
			if (skill === division) {
				return <option selected="selected" key={skill}>{skill}</option>
			} else {
				return <option key={skill}>{skill}</option>
			}
		});

		return (
			<form>
			  <div className="form-group">
			    <label>Player Skill</label><br />
				  <select className="form-control" ref="playerskill">
					  {skillLevels}
					</select>
					<p><small>Try to give an accurate representation of your skill to raise the quality of your gathers</small></p>
			  </div>
			  <div className="form-group">
				  {abilitiesForm}
			  </div>
		  	<p className="small">You will need to rejoin the gather to see your updated profile</p>
			  <div className="form-group">
				  <button 
				  	type="submit"
				  	className="btn btn-primary"
				  	data-dismiss="modal"
				  	onClick={this.handleUserUpdate}>
				  	Update &amp; Close</button>
		  	</div>
			</form>
		);
	}
});

var CurrentUser = React.createClass({
	componentDidMount() {
		let self = this;
		React.render(<AdminPanel />, document.getElementById('admin-menu'));
		React.render(<ProfileModal />, document.getElementById('profile-panel'));
		socket.on("users:update", data => self.setProps({user: data.currentUser}));
		socket.emit("users:refresh");
	},

	render() {
		if (this.props.user) {
			var adminOptions;
			if (this.props.user.admin) {
				adminOptions = (
					<li>
					 	<a href="#" data-toggle="modal" data-target="#adminmodal">
					 		<i className="fa fa-magic fa-fw"></i> Administration
					 	</a>
					</li>
				)
			}
			return (
				<li className="dropdown">
					<a className="dropdown-toggle" data-toggle="dropdown" href="#">
						{this.props.user.username} &nbsp;<img src={this.props.user.avatar}
						alt="User Avatar" 
						height="20"
						width="20" /> <i className="fa fa-caret-down"></i>
					</a>
					<ul className="dropdown-menu dropdown-user">
						<li>
							<a data-toggle="modal" 
								data-target="#profilemodal" 
								href="#"><i className="fa fa-gear fa-fw"></i> Profile</a>
						</li>
						<li>
							<a href="#"><i className="fa fa-flag fa-fw"></i> Notifications</a>
						</li>
						{adminOptions}
					</ul>
				</li>
			);
		} else {
			return false;
		}
	}
});

