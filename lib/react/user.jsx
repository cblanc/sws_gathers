"use strict";

var UserLogin = React.createClass({
	authorizeId(id) {
		socket.emit("users:authorize", {
			id: parseInt(id, 10)
		});
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
});

var UserModal = React.createClass({
	render() {
		let user = this.props.user;
		console.log(user);
		let hiveStats;
		if (user.hive.id) {
			hiveStats = [
			<tr><td><strong>Hive Stats</strong></td><td></td></tr>,
			<tr>
				<td>ELO</td>
				<td>{user.hive.skill}</td>
			</tr>,
			<tr>
				<td>Hours Played</td>
				<td>{Math.round(user.hive.playTime / 3600)}</td>
			</tr>,
			<tr>
				<td>Wins</td>
				<td>{user.hive.wins}</td>
			</tr>,
			<tr>
				<td>Losses</td>
				<td>{user.hive.loses}</td>
			</tr>,
			<tr>
				<td>Kills (/min)</td>
				<td>{user.hive.kills} ({_.round(user.hive.kills / (user.hive.playTime / 60), 1)})</td>
			</tr>,
			<tr>
				<td>Assists (/min)</td>
				<td>{user.hive.assists} ({_.round(user.hive.assists / (user.hive.playTime / 60), 1)})</td>
			</tr>,
			<tr>
				<td>Deaths (/min)</td>
				<td>{user.hive.deaths} ({_.round(user.hive.deaths / (user.hive.playTime / 60), 1)})</td>
			</tr>
			]
		}
		return (
			<div className="modal fade" id={modalId(user)}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" 
								aria-label="Close">
									<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">
								<img src="images/blank.gif" 
									className={"flag flag-" + user.country.toLowerCase()} 
									alt={user.country} />&nbsp;
								{user.username}
							</h4>
						</div>
						<div className="modal-body">
							<div className="text-center">
								<img 
								src={user.avatar} 
								alt="User Avatar" 
								className="img-circle" />
							</div>
							<table className="table">
								<tbody>
									<tr>
										<td>Lifeforms</td>
										<td><LifeformIcons gatherer={{user: user}} /></td>
									</tr>
									<tr>
										<td>Links</td>
										<td>
											<a href={enslUrl(user)} 
												className="btn btn-xs btn-primary"
												target="_blank">ENSL Profile</a>&nbsp;
											<a href={hiveUrl({user: user})} 
												className="btn btn-xs btn-primary"
												target="_blank">Hive Profile</a>
										</td>
									</tr>
									{hiveStats}
								</tbody>
							</table>
						</div>
						<div className="modal-footer">
							<button type="button" 
								className="btn btn-default" 
								data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
})

var UserItem = React.createClass({
	render() {
		let user = this.props.user;
		return (
			<li className="list-group-item">
					<a href="#" data-toggle="modal" 
					data-target={`#${modalId(user)}`}>{user.username}</a>
					<UserModal user={user} />
			</li>
		);
	}
});

var UserMenu = React.createClass({
	render() {
		let users = this.props.users.map(user => {
			return <UserItem user={user} key={user.id} />
		});
		return (
			<div>
				<div className="panel panel-primary add-bottom">
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
			<div className="modal fade" id="adminmodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" 
								aria-label="Close">
									<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Administration Panel</h4>
						</div>
						<div className="modal-body" id="admin-menu">
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

var ProfileModal = React.createClass({
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

		let skillLevel = this.props.user.profile.skill;
		let skillLevels = _.uniq(["Low Skill", "Medium Skill", "High Skill", skillLevel])
			.filter(skill => { return typeof skill === 'string' })
			.map(skill => { return <option key={skill}>{skill}</option>});

		return (
			<div className="modal fade" id="profilemodal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" 
								aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Profile</h4>
						</div>
						<div className="modal-body" id="profile-panel">
							<form>
								<div className="form-group">
									<label>Player Skill</label><br />
									<select 
										defaultValue={skillLevel}
										className="form-control" 
										ref="playerskill">
										{skillLevels}
									</select>
									<p className="add-top"><small>
										Try to give an accurate representation of your skill to raise 
											the quality of your gathers
									</small></p>
								</div>
								<hr />
								<div className="form-group">
									<label>Preferred Lifeforms</label><br />
									{abilitiesForm}
									<p><small>
										Specify which lifeforms you'd like to play in the gather
									</small></p>
								</div>
								<hr />
								<p className="small">
									You will need to rejoin the gather to see your updated profile
								</p>
								<div className="form-group">
									<button 
										type="submit"
										className="btn btn-primary"
										data-dismiss="modal"
										onClick={this.handleUserUpdate}>
										Update &amp; Close</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var CurrentUser = React.createClass({
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
						{adminOptions}
					</ul>
				</li>
			);
		} else {
			return false;
		}
	}
});

var AssumeUserIdButton = React.createClass({
	assumeId(e) {
		e.preventDefault();
		if (this.props.gatherer) {
			socket.emit("users:authorize", {
				id: this.props.gatherer.id
			});
			// Refresh Gather list
			setTimeout(() => {
				socket.emit("gather:refresh");
			}, 5000);
		}
	},

	render() {
		let currentUser = this.props.currentUser;
		let gatherer = this.props.gatherer;
		if (currentUser && gatherer) {
			return <button
				className="btn btn-xs btn-danger" 
				onClick={this.assumeId}>Assume User ID</button>
		}
	}
});
