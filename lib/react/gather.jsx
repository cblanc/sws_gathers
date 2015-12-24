"use strict";

var SelectPlayerButton = React.createClass({
	selectPlayer(e) {
		e.preventDefault();
		socket.emit("gather:select", {
			player: parseInt(e.target.value, 10)
		})
	},

	render() {
		let button;
		if (this.props.gatherer.leader) {
			button = <button 
				className="btn btn-xs btn-default team-label"
				data-disabled="true">Leader</button>;
		} else if (this.props.gatherer.team !== "lobby") {
			button = <button
				data-disabled="true"
				className="btn btn-xs btn-default team-label"> 
					{_.capitalize(this.props.gatherer.team)}
				</button>;
		} else {
			button = <button
				onClick={this.selectPlayer}
				value={this.props.gatherer.id}
				className="btn btn-xs btn-primary team-label"> Select
				</button>;
		}
		return button;
	}
});

var GathererList = React.createClass({
	memberList() {
		var self = this;
		return this.props.gather.gatherers
			.filter(gatherer => gatherer.team === self.props.team)
			.sort(gatherer => { return gatherer.leader ? 1 : -1 });
	},

	render() {
		var extractGatherer = gatherer => {
			let image;
			if (gatherer.leader) {
				image = <i className="fa fa-star add-right"></i>;
			}
			return (
				<tr key={gatherer.id}>
					<td className="col-md-12">
						{image}{gatherer.user.username}
						<span className="pull-right">
							<LifeformIcons gatherer={gatherer} />
						</span>
					</td>
				</tr>
			);
		}
		var members = this.memberList()
			.map(extractGatherer);
		return (
			<table className="table">
				<tbody>
					{members}
				</tbody>
			</table>
		);
	}
});

var GatherTeams = React.createClass({
	render() {
		return (
			<div className="row add-top">
				<div className="col-sm-6">
					<div className="panel panel-primary panel-light-background">
						<div className="panel-heading">
							Marines
						</div>
						<GathererList gather={this.props.gather} team="marine" />
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-primary panel-light-background">
						<div className="panel-heading">
							Aliens
						</div>
						<GathererList gather={this.props.gather} team="alien" />
					</div>
				</div>
			</div>
		);
	}
});

var ElectionProgressBar = React.createClass({
	componentDidMount() {
		var self = this;
		this.timer = setInterval(() => {
			self.forceUpdate();
		}, 900);
	},

	progress() {
		var interval = this.props.gather.election.interval;
		var startTime = (new Date(this.props.gather.election.startTime)).getTime();
		var msTranspired = Math.floor((new Date()).getTime() - startTime);

		return {
			num: msTranspired,
			den: interval,
			barMessage: Math.floor((interval - msTranspired) / 1000) + "s remaining"
		}
	},

	componentWillUnmount() {
		clearInterval(this.timer);
	},

	render() {
		return (<ProgressBar progress={this.progress()} />);
	}
});

var ProgressBar = React.createClass({
	render() {
		let progress = this.props.progress;
		var style = {
			width: Math.round((progress.num / progress.den * 100)) + "%"
		};
		var barMessage = progress.barMessage || "";
		return (
			<div className="progress">
				<div className="progress-bar progress-bar-striped active" 
					data-role="progressbar" 
					data-aria-valuenow={progress.num} 
					data-aria-valuemin="0" 
					data-aria-valuemax={progress.den} 
					style={style}>{barMessage}
				</div>
			</div>
		);
	}
});

var GatherProgress = React.createClass({
	stateDescription() {
		switch(this.props.gather.state) {
			case "gathering":
				return "Waiting for more gatherers.";
			case "election":
				return "Currently voting for team leaders.";
			case "selection":
				return "Waiting for leaders to pick teams.";
			case "done":
				return "Gather completed.";
			default:
				return "Initialising gather.";
		}
	},

	gatheringProgress() {
		var num = this.props.gather.gatherers.length;
		var den = 12;
		var remaining = den - num;
		var message = (remaining === 1) ? 
			"Waiting for last player" : `Waiting for ${remaining} more players`;
		return {
			num: num,
			den: den,
			message: message
		};
	},

	electionProgress() {
		var num = this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.leaderVote) acc++;
			return acc;
		}, 0);
		var den = 12;
		return {
			num: num,
			den: den,
			message: den - num + " more votes required"
		};
	},

	selectionProgress() {
		var num = this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.team !== "lobby") acc++;
			return acc;
		}, 0);
		var den = 12;

		return {
			num: num,
			den: den,
			message: `${num} out of ${den} players assigned. Waiting 
				on ${_.capitalize(this.props.gather.pickingTurn)}s to pick next...`
		};
	},

	render() {
		var progress, progressBar;
		var gatherState = this.props.gather.state;
		if (gatherState === 'gathering' && this.props.gather.gatherers.length) {
			progress = this.gatheringProgress();
			progressBar = (<ProgressBar progress={progress} />);
		} else if (gatherState === 'election') {
			progress = this.electionProgress();
			progressBar = (<ElectionProgressBar {...this.props} progress={progress} />);
		} else if (gatherState === 'selection') {
			progress = this.selectionProgress();
			progressBar = (<ProgressBar progress={progress} />);
		}

		if (!progress) return false;

		return (
			<div className="no-bottom">
				<p><strong>{this.stateDescription()}</strong> {progress.message}</p>
				{progressBar}
			</div>
		);
	}
});

let teamspeakDefaults = {
	url: "ts3server://ensl.org/",
	password: "ns2gather",
	alien: {
		channel: "NS2 Gather/Gather #1/Alien",
		password: "ns2gather"
	},
	marine: {
		channel: "NS2 Gather/Gather #1/Marine",
		password: "ns2gather"
	}
};

var TeamSpeakButton = React.createClass({
	getDefaultProps() {
		return teamspeakDefaults
	},
	marineUrl() {
		return this.teamSpeakUrl(this.props.marine);
	},
	alienUrl() {
		return this.teamSpeakUrl(this.props.alien);
	},
	teamSpeakUrl(conn) {
		let params = `channel=${encodeURIComponent(conn.channel)}&
			channelpassword=${encodeURIComponent(conn.password)}`;
		return (`${this.props.url}?${params}`);
	},
	render() {
		return (
			<ul className="nav navbar-top-links navbar-right">
			  <li className="dropdown">
					<a className="dropdown-toggle" data-toggle="dropdown" href="#">
						Teamspeak &nbsp;<i className="fa fa-caret-down"></i>
					</a>
					<ul className="dropdown-menu">
						<li><a href={this.props.url}>Join Teamspeak Lobby</a></li>
						<li><a href={this.marineUrl()}>Join Marine Teamspeak</a></li>
						<li><a href={this.alienUrl()}>Join Alien Teamspeak</a></li>
						<li role="separator" className="divider"></li>
						<li><a href="#" data-toggle="modal" data-target="#teamspeakmodal">Teamspeak Details</a></li>
					</ul>
				</li>
		  </ul>
		);
	}
});

var TeamSpeakModal = React.createClass({
	getDefaultProps() {
		return teamspeakDefaults;
	},

	render() {
		return <div className="modal fade text-left" id="teamspeakmodal">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" 
							className="close" 
							data-dismiss="modal" 
							aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 className="modal-title">Teamspeak Server Information</h4>
					</div>
					<div className="modal-body">
						<dl className="dl-horizontal">
							<dt>Server</dt>
							<dd>{this.props.url}</dd>
							<dt>Password</dt>
							<dd>{this.props.password}</dd>
							<dt>Marine Channel</dt>
							<dd>{this.props.marine.channel}</dd>
							<dt>Alien Channel</dt>
							<dd>{this.props.alien.channel}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	}
});

var JoinGatherButton = React.createClass({
	componentDidMount() {
		var self = this;
		this.timer = setInterval(() => {
			self.forceUpdate();
		}, 30000);
	},

	componentWillUnmount() {
		clearInterval(this.timer);
	},

	joinGather(e) {
		e.preventDefault();
		socket.emit("gather:join");
	},

	leaveGather(e) {
		e.preventDefault();
		socket.emit("gather:leave");
	},

	cooldownTime() {
		let user = this.props.user;
		if (!user) return false;
		let cooloffTime = this.props.gather.cooldown[user.id];
		if (!cooloffTime) return false;
		let timeRemaining = new Date(cooloffTime) - new Date();
		return timeRemaining > 0 ? timeRemaining : false;
	},

	render() {
		let gather = this.props.gather;
		let thisGatherer = this.props.thisGatherer;
		if (thisGatherer) {
			return <button 
							onClick={this.leaveGather} 
							className="btn btn-danger">Leave Gather</button>;
		} 
		if (gather.state === 'gathering') {
			let cooldownTime = this.cooldownTime();
			if (cooldownTime) {
				return <CooloffButton timeRemaining={cooldownTime} />;
			} else {
				return <button 
						onClick={this.joinGather} 
						className="btn btn-success">Join Gather</button>;
			}
		}
		return false;
	}
});

var CooloffButton = React.createClass({
	timeRemaining() {
		return `${Math.floor(this.props.timeRemaining / 60000) + 1} minutes remaining`;
	},

	render() {
		return <button 
			disabled="true"
			className="btn btn-success">
				Leaver Cooloff ({this.timeRemaining()})
		</button>
	}
})

var GatherActions = React.createClass({
	voteRegather(e) {
		e.preventDefault(e);
		socket.emit("gather:vote", {
			regather: (e.target.value === "true")
		});
	},

	regatherVotes() {
		let gather = this.props.gather;
		if (!gather) return 0;
		return gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.regatherVote) acc++;
			return acc;
		}, 0);
	},

	render() {
		let regatherButton;
		let user = this.props.user;
		let gather = this.props.gather;
		let thisGatherer = this.props.thisGatherer;
		if (thisGatherer) {
			let regatherVotes = this.regatherVotes();
			if (thisGatherer.regatherVote) {
				regatherButton = <button value="false" onClick={this.voteRegather} 
						className="btn btn-danger">
							{`Voted Regather (${regatherVotes}/8)`}
					</button>;
			} else {
				regatherButton = <button value="true" onClick={this.voteRegather} 
						className="btn btn-danger">
							{`Vote Regather (${regatherVotes}/8)`}
					</button>;
			}
		}

		return (
			<div>
				<div className="text-right">
					<ul className="list-inline no-bottom">
						<li>
							{regatherButton}
						</li>
						<li>
							<JoinGatherButton gather={gather} thisGatherer={thisGatherer}
								user={user} />
						</li>
					</ul>
				</div>
			</div>
		);
	}
});

var VoteButton = React.createClass({
	cancelVote(e) {
		socket.emit("gather:vote", {
			leader: {
				candidate: null
			}
		});
	},

	vote(e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			leader: {
				candidate: parseInt(e.target.value, 10)
			}
		});
	},

	stopGatherMusic() {
		soundController.stop();
	},

	render() {
		let candidate = this.props.candidate;
		let thisGatherer = this.props.thisGatherer;
		if (thisGatherer === null) {
			return false;
		}
		if (thisGatherer.leaderVote === candidate.id) {
			return (
				<button 
					onClick={this.cancelVote} 
					className="btn btn-xs btn-success vote-button">Voted
				</button>
			);
		} else {
			return (
				<button 
					onClick={this.vote} 
					className="btn btn-xs btn-primary vote-button"
					value={candidate.id}>Vote
				</button>
			);
		}
	}
});

var ServerVoting = React.createClass({
	voteHandler(serverId) {
		return function (e) {
			e.preventDefault();
			socket.emit("gather:vote", {
				server: {
					id: serverId
				}
			});
		}
	},

	votesForServer(server) {
		return this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.serverVote.some(voteId => voteId === server.id)) acc++;
			return acc;
		}, 0);
	},

	render() {
		let self = this;
		let thisGatherer = self.props.thisGatherer;
		let servers = self.props.servers.sort((a, b) => {
				var aVotes = self.votesForServer(a);
				var bVotes = self.votesForServer(b);
				return bVotes - aVotes;
			}).map(server => {
			let votes = self.votesForServer(server);
			if (thisGatherer.serverVote.some(voteId => voteId === server.id)) {
				return (
					<a href="#" 
						className="list-group-item list-group-item-success" 
						onClick={ e => e.preventDefault() } 
						key={server.id}>
						<span className="badge">{votes}</span>
						{server.name || server.description}
					</a>
				);				
			} else {
				return (
					<a href="#" className="list-group-item" 
						onClick={self.voteHandler(server.id)}
						key={server.id}>
						<span className="badge">{votes}</span>
						{server.name || server.description}
					</a>
				);
			}
		});

		let votes = thisGatherer.serverVote.length;

		return (
			<div className="panel panel-primary">
				<div className="panel-heading">
					{votes === 2 ? "Server Votes" : 
					`Please Vote for a Server. ${2 - votes} votes remaining` }
				</div>
				<div className="list-group gather-voting">
					{servers}
				</div>
			</div>
		);
	}
})

var MapVoting = React.createClass({
	voteHandler(mapId) {
		return function (e) {
			e.preventDefault();
			socket.emit("gather:vote", {
				map: {
					id: mapId
				}
			});
		}
	},

	votesForMap(map) {
		return this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.mapVote.some(voteId => voteId === map.id)) acc++;
			return acc;
		}, 0);
	},

	render() {
		var self = this;
		let thisGatherer = self.props.thisGatherer
		let maps = self.props.maps.sort((a, b) => {
					var aVotes = self.votesForMap(a);
					var bVotes = self.votesForMap(b);
					return bVotes - aVotes;
				}).map(map => {
				let votes = self.votesForMap(map);
				if (thisGatherer.mapVote.some(voteId => voteId === map.id)) {
					return (
						<a href="#" 
							key={map.id} 
							onClick={ e => e.preventDefault() } 
							className="list-group-item list-group-item-success">
								<span className="badge">{votes}</span>
								{map.name}
						</a>
					);
				} else {
					return (
						<a href="#" 
							key={map.id} 
							onClick={self.voteHandler(map.id)}
							className="list-group-item">
								<span className="badge">{votes}</span>
								{map.name}
						</a>
					);
				}
			});

		let votes = thisGatherer.mapVote.length;

		return (
			<div className="panel panel-primary">
				<div className="panel-heading">
					{votes === 2 ? "Map Votes" : 
						`Please Vote for a Map. ${2 - votes} votes remaining` }
				</div>
				<div className="list-group gather-voting">
					{maps}
				</div>
			</div>
		);
	}
})

var Gather = React.createClass({
	render() {
		let gather = this.props.gather;
		let thisGatherer = this.props.thisGatherer;
		let servers = this.props.servers;
		let maps = this.props.maps;
		let user = this.props.user;
		if (gather === null) return <div></div>;

		let voting;
		if (thisGatherer) {
			let state = gather.state;
			if (state === 'gathering' || state === 'election') {
				voting = (
					<div className="row add-top">
						<div className="col-sm-6">
							<MapVoting gather={gather} maps={maps} 
								thisGatherer={thisGatherer} />
						</div>
						<div className="col-sm-6">
							<ServerVoting gather={gather} servers={servers}
								thisGatherer={thisGatherer} />
						</div>
					</div>
				);
			} else {
				voting = <GatherVotingResults gather={gather} 
					servers={servers} 
					maps={maps} />;
			}
		}

		let gatherTeams;
		if (gather.state === 'selection') {
			gatherTeams = <GatherTeams gather={gather} />;
		}

		if (gather.gatherers.length > 0) {
			return (
				<div>
					<div className="panel panel-primary add-bottom">
						<div className="panel-heading">Current Gather</div>
						<div className="panel-body">
							<GatherProgress gather={gather} />
							<GatherActions gather={gather} user={user} thisGatherer={thisGatherer} />
						</div>
					</div>
					<Gatherers gather={gather} user={user} 
						soundController={this.props.soundController}
						thisGatherer={thisGatherer} />
					{gatherTeams}
					{voting}
				</div>
			);
		} else {
			return (
				<div>
					<div className="panel panel-primary add-bottom">
						<div className="panel-heading">Current Gather</div>
					</div>
					<Gatherers gather={gather} user={user} thisGatherer={thisGatherer} />
				</div>
			);
		}

	}
});

var LifeformIcons = React.createClass({
	availableLifeforms() {
		return ["skulk", "gorge", "lerk", "fade", "onos", "commander"];
	},

	gathererLifeforms() {
		let lifeforms = [];
		let gatherer = this.props.gatherer;
		let abilities = gatherer.user.profile.abilities;
		for (let attr in abilities) {
			if (abilities[attr]) lifeforms.push(_.capitalize(attr));
		}
		return lifeforms;
	},

	render() {
		let lifeforms = this.gathererLifeforms();	
		let availableLifeforms = this.availableLifeforms();
		let icons = availableLifeforms.map(lifeform => {
			let containsAbility = lifeforms.some(gathererLifeform => {
				return gathererLifeform.toLowerCase() === lifeform.toLowerCase()
			});
			if (containsAbility) {
				return <img 
					className="lifeform-icon"
					key={lifeform}
					src={`/images/${lifeform.toLowerCase()}.png`} />
			} else {
				return <img 
					className="lifeform-icon"
					key={lifeform}
					src={`/images/blank.gif`} />
			}
		});
		return <span className="add-right hidden-xs">{icons}</span>
	}
});

var Gatherers = React.createClass({
	joinGather(e) {
		e.preventDefault();
		socket.emit("gather:join");
	},

	bootGatherer(e) {
		e.preventDefault();
		socket.emit("gather:leave", {
			gatherer: parseInt(e.target.value, 10) || null
		});
	},

	render() {
		let self = this;
		let user = this.props.user;
		let gather = this.props.gather;
		let admin = (user && user.admin) || (user && user.moderator);
		let thisGatherer = this.props.thisGatherer;
		let gatherers = gather.gatherers
		.sort((a, b) => {
				return (b.user.hive.skill || 1000) - (a.user.hive.skill || 1000);
			})
		.map(gatherer => {
			if (gatherer.user.country) {
				var country = (
					<img src="images/blank.gif" 
						className={"flag flag-" + gatherer.user.country.toLowerCase()} 
						alt={gatherer.user.country} />
				);
			};

			let skill = gatherer.user.profile.skill || "Not Available";

			let hiveStats = [];
			if (gatherer.user.hive.skill) hiveStats.push(`${gatherer.user.hive.skill} ELO`);

			if (gatherer.user.hive.playTime) {
				hiveStats.push(`${Math.floor(gatherer.user.hive.playTime / 3600)} Hours`);
			}

			let hive = (hiveStats.length) ? hiveStats.join(", ") : "Not Available";
			
			let team = (gatherer.user.team) ? gatherer.user.team.name : "None";

			let action;
			if (gather.state === "election") {
				let votes = gather.gatherers.reduce((acc, voter) => {
					if (voter.leaderVote === gatherer.id) acc++;
					return acc;
				}, 0)
				action = (
					<span>
						<span className="badge add-right">{votes + " votes"}</span>
						<VoteButton 
							thisGatherer={thisGatherer} 
							soundController={this.props.soundController}
							candidate={gatherer} />
					</span>
				);
			}

			if (gather.state === 'selection') {
				if (thisGatherer && 
						thisGatherer.leader &&
						thisGatherer.team === gather.pickingTurn) {
					action = (
						<span>
							<SelectPlayerButton gatherer={gatherer} />
						</span>
					);
				} else {
					if (gatherer.leader) {
						action = (<span className={`label label-padding 
							label-${gatherer.team} 
							team-label`}>Leader</span>);
					} else if (gatherer.team !== "lobby") {
						action = (<span className={`label label-padding 
							label-${gatherer.team} 
							team-label`}>{_.capitalize(gatherer.team)}</span>);
					} else {
						action = (<span className="label label-padding label-default team-label">
							Lobby</span>);
					}
				}
			}

			let adminOptions;
			if (admin) {
				adminOptions = [
					<hr />,
					<dt>Admin</dt>,
					<dd>
						<button
							className="btn btn-xs btn-danger"
							value={gatherer.user.id}
							onClick={this.bootGatherer}>
							Boot from Gather
						</button>&nbsp;
						<AssumeUserIdButton 
							gatherer={gatherer} 
							currentUser={user} />
					</dd>
				]
			}

			let tabColor = gatherer.team !== "lobby" ? `panel-${gatherer.team}` : "panel-info";
			return (
				<div className={`panel ${tabColor} gatherer-panel`} 
					key={gatherer.user.id} data-userid={gatherer.user.id}>
					<div className="panel-heading">
						<h4 className="panel-title">
							{country} {gatherer.user.username}
							<span className="pull-right">
								<a data-toggle="collapse"
									href={"#"+gatherer.user.id.toString() + "-collapse"} 
									aria-expanded="false" 
									className="btn btn-xs btn-primary add-right"
									aria-controls={gatherer.user.id.toString() + "-collapse"}>
									Info <span className="caret"></span></a>
								<LifeformIcons gatherer={gatherer} />
								{action}
							</span>
						</h4>
					</div>
					<div id={gatherer.user.id.toString() + "-collapse"} 
						className="panel-collapse collapse out" >
						<div className="panel-body">
							<dl className="dl-horizontal">
								<dt>Skill Level</dt>
								<dd>{skill}</dd>
								<dt>Team</dt>
								<dd>{team}</dd>
								<dt>Hive Stats</dt>
								<dd>{hive}</dd>
								<dt>Links</dt>
								<dd>
									<a href={enslUrl(gatherer)} 
										className="btn btn-xs btn-primary"
										target="_blank">ENSL Profile</a>&nbsp;
									<a href={hiveUrl(gatherer)} 
										className="btn btn-xs btn-primary"
										target="_blank">Hive Profile</a>
								</dd>
								{adminOptions}
							</dl>
						</div>
					</div>
				</div>
			);
		})
		if (gather.gatherers.length) {
			return (
				<div class="panel-group" 
					role="tablist" 
					aria-multiselectable="true" 
					id="gatherers-panel">
					{gatherers}
				</div>
			);
		} else {
			return (
				<div className="panel panel-primary add-bottom">
					<div className="panel-body text-center join-hero">
						<button 
							onClick={this.joinGather} 
							className="btn btn-success btn-lg">Start a Gather</button>
					</div>
				</div>
			);
		}
	}
});

var CompletedGather = React.createClass({
	completionDate() {
		let d = new Date(this.props.gather.done.time);
		if (d) {
			return d.toLocaleTimeString();
		} else {
			return "Completed Gather"
		}
	},

	getInitialState() {
		return {
			show: !!this.props.show
		};
	},

	toggleGatherInfo() {
		let newState = !this.state.show;
		this.setState({
			show: newState
		});
	},

	render() {
		let gatherInfo = [];
		let gather = this.props.gather;
		let maps = this.props.maps;
		let servers = this.props.servers;
		if (this.state.show) {
			gatherInfo.push(<GatherTeams gather={gather} />);
			gatherInfo.push(<GatherVotingResults gather={gather} 
				maps={maps} 
				servers={servers}/>);
		}
		return (
			<div>
				<div className="panel panel-success add-bottom pointer"
					onClick={this.toggleGatherInfo}>
					<div className="panel-heading"><strong>{this.completionDate()}</strong></div>
				</div>
				{gatherInfo}
			</div>
		);
	}
});

var GatherVotingResults = React.createClass({
	// Returns an array of ids voted for e.g. [1,2,5,1,1,3,2]
	countVotes(voteType) {
		return this.props.gather.gatherers.reduce((acc, gatherer) => {
			let votes = gatherer[voteType];

			// Temporary fix because some mapvotes are ints and not arrays
			if (!Array.isArray(votes)) votes = [votes];

			if (votes.length > 0) votes.forEach(vote => acc.push(vote));
			return acc;
		}, []);
	},

	selectedMaps() {
		return rankVotes(this.countVotes('mapVote'), this.props.maps).slice(0, 2)
	},

	selectedServer() {
		return rankVotes(this.countVotes('serverVote'), this.props.servers).slice(0, 1);
	},

	render() {
		let maps = this.selectedMaps();
		let server = this.selectedServer().pop();
		let password;
		if (server.password) {
			password = [
				<dt>Password</dt>,
				<dd>{server.password}</dd>
			];
		}
		return (
			<div className="panel panel-primary">
				<div className="panel-heading">
					Server
				</div>
				<div className="panel-body">
					<dl className="dl-horizontal">
						<dt>Maps</dt>
						<dd>{maps.map(map => map.name).join(" & ")}</dd>
						<dt>Server</dt>
						<dd>{server.name}</dd>
						<dt>Address</dt>
						<dd>{server.ip}:{server.port}</dd>
						{password}
					</dl>
					<p>
						<a href={`steam://run/4920/connect+%20${server.ip}:${server.port}%20+password%20${server.password}`}
							className="btn btn-primary max-width">Join Server</a>
					</p>
				</div>
			</div>
		);
	}
});

var ArchivedGathers = React.createClass({
	render() {
		let archive = this.props.archive
			.sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt);
			})
			.map((archivedGather, index) => {
				return <CompletedGather 
					id={archivedGather.gather.done.time}
					show={(index === 0) ? true : false}
					gather={archivedGather.gather} 
					maps={this.props.maps}
					servers={this.props.servers} />
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
