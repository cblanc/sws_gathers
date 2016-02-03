import {LifeformIcons} from "javascripts/components/gather";
const React = require("react");
const helper = require("javascripts/helper");
const enslUrl = helper.enslUrl;
const hiveUrl = helper.hiveUrl;
const modalId = helper.modalId;
const Ps = require('perfect-scrollbar');

const UserLogin = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	authorizeId(id) {
		this.props.socket.emit("users:authorize", {
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

const DisconnectUserButton = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired,
		id: React.PropTypes.number.isRequired
	},

	getDefaultProps() {
		return {
			id: null
		};
	},

	disconnectUser() {
		this.props.socket.emit("users:disconnect", {
			id: this.props.id
		});
	},
	
	render() {
		return <button
			className="btn btn-danger"
			onClick={this.disconnectUser}>
			Disconnect User</button>
	}
});

const UserModal = React.createClass({
	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired,
		close: React.PropTypes.func.isRequired
	},

	render() {
		const currentUser = this.props.currentUser;
		const user = this.props.user;
		let hiveStats;
		if (user.hive.id) {
			hiveStats = [
			<tr key="stats"><td><strong>Hive Stats</strong></td><td></td></tr>,
			<tr key="elo">
				<td>ELO</td>
				<td>{user.hive.skill}</td>
			</tr>,
			<tr key="hours">
				<td>Hours Played</td>
				<td>{Math.round(user.hive.playTime / 3600)}</td>
			</tr>,
			<tr key="wins">
				<td>Wins</td>
				<td>{user.hive.wins}</td>
			</tr>,
			<tr key="losses">
				<td>Losses</td>
				<td>{user.hive.loses}</td>
			</tr>,
			<tr key="kills">
				<td>Kills (/min)</td>
				<td>{user.hive.kills} ({_.round(user.hive.kills / (user.hive.playTime / 60), 1)})</td>
			</tr>,
			<tr key="assists">
				<td>Assists (/min)</td>
				<td>{user.hive.assists} ({_.round(user.hive.assists / (user.hive.playTime / 60), 1)})</td>
			</tr>,
			<tr key="deaths">
				<td>Deaths (/min)</td>
				<td>{user.hive.deaths} ({_.round(user.hive.deaths / (user.hive.playTime / 60), 1)})</td>
			</tr>
			]
		}
		let adminOptions;
		if (currentUser.admin) {
			adminOptions = <DisconnectUserButton id={user.id} socket={this.props.socket} />;
		}

		return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" onClick={this.props.close}
							aria-label="Close">
								<span aria-hidden="true">&times;</span>
						</button>
						<h4 className="modal-title">
							<img src="blank.gif" 
								className={"flag flag-" + ((user.country === null) ? "eu" : 
									user.country.toLowerCase()) } 
								alt={user.country} />&nbsp;
							{user.username}
						</h4>
					</div>
					<div className="modal-body">
						<div className="text-center">
							<img 
							src={user.avatar} 
							alt="User Avatar" />
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
						{adminOptions}
						<button type="button" 
							className="btn btn-default" 
							onClick={this.props.close}
							>Close</button>
					</div>
				</div>
			</div>
		);
	}
})

const UserItem = React.createClass({
	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired,
		mountModal: React.PropTypes.func.isRequired
	},

	openModal(e) {
		e.preventDefault();
		this.props.mountModal({
			component: UserModal,
			props: {
				user: this.props.user,
				currentUser: this.props.currentUser,
				socket: this.props.socket
			}
		});
	},

	render() {
		const user = this.props.user;
		const currentUser = this.props.currentUser;
		return (
			<li className="users-list-group-item">
				<a href="#" onClick={this.openModal}>{user.username}</a>
			</li>
		);
	}
});

const UserMenu = exports.UserMenu = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired,
		users: React.PropTypes.array.isRequired,
		mountModal: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		Ps.initialize(document.getElementById('user-list'));
	},

	render() {
		const users = this.props.users
		.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1)
		.map(user => {
			return <UserItem user={user} key={user.id} 
				currentUser={this.props.user} socket={this.props.socket} 
				mountModal={this.props.mountModal} />
		});
		return (
			<div className="user-panel">
				<ul className="users-list-group" id="user-list">
					{users}
				</ul>
			</div>
		);
	}
});

const AdminPanel = exports.AdminPanel = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	handleGatherReset() {
		this.props.socket.emit("gather:reset");
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
							<h5>Swap Into a Different Account (Only works for admins)</h5>
							<UserLogin socket={this.props.socket} />
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

const ProfileModal = exports.ProfileModal = React.createClass({
	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		close: React.PropTypes.func.isRequired
	},

	getInitialState() {
		const user = this.props.user;
		console.log(user.profile);
		return {
			abilities: {
				skulk: user.profile.abilities.skulk,
				lerk: user.profile.abilities.lerk,
				gorge: user.profile.abilities.gorge,
				fade: user.profile.abilities.fade,
				onos: user.profile.abilities.onos,
				commander: user.profile.abilities.commander
			},
			skill: user.profile.skill
		};
	},

	handleUserUpdate(e) {
		e.preventDefault();
		this.props.socket.emit("users:update:profile", {
			id: this.props.user.id,
			profile: {
				abilities: this.state.abilities,
				skill: this.state.skill
			}
		});
		this.props.close();
	},

	handleAbilityChange(e) {
		let abilities = this.state.abilities;
		abilities[e.target.name] = e.target.checked;
		this.setState({abilities: abilities});
	},

	handleSkillChange(e) {
		this.setState({ skill: e.target.value });
	},

	render() {
		const user = this.props.user;
		if (!user) return false;

		const abilities = this.state.abilities;

		let abilitiesForm = [];
		for (let lifeform in abilities) {
			abilitiesForm.push(
				<div key={lifeform} className="checkbox">
					<label className="checkbox-inline">
						<input type="checkbox" name={lifeform} 
							checked={abilities[lifeform]} onChange={this.handleAbilityChange} /> 
							{_.capitalize(lifeform)}
					</label>
				</div>
			);
		}

		let skillLevel = user.profile.skill;
		let skillLevels = _.uniq(["Low Skill", "Medium Skill", "High Skill", skillLevel])
			.filter(skill => { return typeof skill === 'string' })
			.map(skill => { return <option key={skill} value={skill}>{skill}</option>});

		return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" aria-label="Close" 
							onClick={this.props.close}>
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 className="modal-title">Profile</h4>
					</div>
					<div className="modal-body" id="profile-panel">
						<form>
							<div className="form-group">
								<label>Player Skill</label><br />
								<select 
									value={skillLevel}
									className="form-control" 
									onChange={this.handleSkillChange}>
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
									onClick={this.handleUserUpdate}>
									Update &amp; Close</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

const CurrentUser = exports.CurrentUser = React.createClass({
	render() {
		if (this.props.user) {
			let adminOptions;
			if (this.props.user.admin || this.props.user.moderator) {
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
								href="#"><i className="fa fa-user fa-fw"></i> Profile</a>
						</li>
						<li>
							<a data-toggle="modal" 
								data-target="#settingsmodal" 
								href="#"><i className="fa fa-gear fa-fw"></i> Settings</a>
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

var AssumeUserIdButton = exports.AssumeUserIdButton = React.createClass({
	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gatherer: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired,
	},

	assumeId(e) {
		e.preventDefault();
		if (this.props.gatherer) {
			this.props.socket.emit("users:authorize", {
				id: this.props.gatherer.id
			});
			// Refresh Gather list
			setTimeout(() => {
				this.props.socket.emit("gather:refresh");
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
