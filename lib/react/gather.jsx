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
				className="btn btn-xs btn-default"
				data-disabled="true">Leader</button>;
		} else if (this.props.gatherer.team !== "lobby") {
			button = <button
				data-disabled="true"
				className="btn btn-xs btn-default"> {this.props.gatherer.team}
				</button>;
		} else {
			button = <button
				onClick={this.selectPlayer}
				value={this.props.gatherer.id}
				className="btn btn-xs btn-primary"> Select
				</button>;
		}
		return button;
	}
});

var GathererList = React.createClass({
	memberList() {
		var self = this;
		return this.props.gather.gatherers
			.filter(gatherer => gatherer.team === self.props.team )
			.sort(gatherer => gatherer.leader ? 1 : -1);
	},

	render() {
		var extractGatherer = gatherer => {
			var image;
			if (gatherer.leader) {
				image = (<img src="/images/commander.png" 
					alt="Commander" 
					height="20"
					width="20" />);
			}
			return (
				<tr key={gatherer.id}>
					<td className="col-md-1">{image}</td>
					<td className="col-md-11">{gatherer.user.username}</td>
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
					<div className="panel panel-default">
						<div className="panel-heading">
							Marines
						</div>
						<GathererList gather={this.props.gather} team="marine" />
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-default">
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
		var style = {
			width: Math.round((this.props.progress.num / this.props.progress.den * 100)) + "%"
		};
		var barMessage = this.props.progress.barMessage || "";
		return (
			<div className="progress">
				<div className="progress-bar progress-bar-striped active" 
					data-role="progressbar" 
					data-aria-valuenow={this.props.progress.num} 
					data-aria-valuemin="0" 
					data-aria-valuemax={this.props.progress.den} 
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
		var message = (remaining === 1) ? "Waiting for last player" : "Waiting for " + remaining + " more players";
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

var TeamSpeakButton = React.createClass({
	getDefaultProps() {
		let password = "ns2gather";
		return {
			url: "ts3server://ensl.org/",
			password: password,
			alien: {
				channel: "NS2 Gather/Gather #1/Alien (Team Y)",
				password: password
			},
			marine: {
				channel: "NS2 Gather/Gather #1/Marine (Team X)",
				password: password
			}
		};
	},
	marineUrl() {
		return this.teamSpeakUrl(this.props.marine);
	},
	alienUrl() {
		return this.teamSpeakUrl(this.props.alien);
	},
	teamSpeakUrl(conn) {
		let params = `channel=${encodeURIComponent(conn.channel)}&channelpassword=${encodeURIComponent(conn.password)}`;
		return (`${this.props.url}?${params}`);
	},
	render() {
		return (
			<div className="btn-group dropup">
				<button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Teamspeak <span className="caret"></span>
				</button>
				<ul className="dropdown-menu">
					<li><a href={this.props.url}>Join Teamspeak Lobby</a></li>
					<li><a href={this.marineUrl()}>Join Marine Teamspeak</a></li>
					<li><a href={this.alienUrl()}>Join Alien Teamspeak</a></li>
					<li role="separator" className="divider"></li>
					<li><a href="#" data-toggle="modal" data-target="#teamspeakmodal">Teamspeak Details</a></li>
				</ul>
				<div className="modal fade text-left" id="teamspeakmodal">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
			</div>
		);
	}
});

var GatherActions = React.createClass({
	joinGather(e) {
		e.preventDefault();
		socket.emit("gather:join");
	},

	leaveGather(e) {
		e.preventDefault();
		socket.emit("gather:leave");
	},

	voteRegather(e) {
		e.preventDefault(e);
		socket.emit("gather:vote", {
			regather: (e.target.value === "true")
		});
	},

	regatherVotes() {
		if (!this.props.gather) return 0;
		return this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer.regatherVote) acc++;
			return acc;
		}, 0);
	},

	render() {
		var joinButton;
		var currentGatherer = this.props.currentGatherer;
		if (currentGatherer) {
			joinButton = (<li><button 
							onClick={this.leaveGather} 
							className="btn btn-danger">Leave Gather</button></li>);
		} else if (this.props.gather.state === 'gathering') {
			joinButton = (
				<button 
					onClick={this.joinGather} 
					className="btn btn-success">Join Gather</button>
			);
		}

		var regatherButton;
		if (currentGatherer) {
			let regatherVotes = this.regatherVotes();
			if (currentGatherer.regatherVote) {
				regatherButton = (
					<li><button 
						value="false"
						onClick={this.voteRegather} 
						className="btn btn-danger">{`Voted Regather (${regatherVotes}/6)`}</button></li>);
			} else {
				regatherButton = (
					<li><button 
						value="true"
						onClick={this.voteRegather} 
						className="btn btn-danger">{`Vote Regather (${regatherVotes}/6)`}</button></li>);
			}
		}

		return (
			<div className="panel panel-default gather-actions">
				<div className="panel-body">
					<div className="text-right">
						<ul className="list-inline no-bottom">
							<TeamSpeakButton />&nbsp;
							{regatherButton}&nbsp;
							{joinButton}
						</ul>
					</div>
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

	render() {
		if (this.props.currentGatherer === null) {
			return false;
		}
		if (this.props.currentGatherer.leaderVote === this.props.candidate.id) {
			return (
				<button 
					onClick={this.cancelVote} 
					className="btn btn-xs btn-success">Voted
				</button>
			);
		} else {
			return (
				<button 
					onClick={this.vote} 
					className="btn btn-xs btn-primary"
					value={this.props.candidate.id}>Vote
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
			if (server.id === gatherer.serverVote) acc++;
			return acc;
		}, 0);
	},

	render() {
		var self = this;
		let servers = self.props.servers.map(server => {
			let votes = self.votesForServer(server);
			if (self.props.currentGatherer.serverVote === server.id) {
				return (
					<a href="#" 
						className="list-group-item list-group-item-success" 
						onClick={ e => e.preventDefault() } 
						key={server.id}>
						<span className="badge">{votes}</span>
						{server.name || server.description || server.dns}
					</a>
				);				
			} else {
				return (
					<a href="#" className="list-group-item" 
						onClick={self.voteHandler(server.id)}
						key={server.id}>
						<span className="badge">{votes}</span>
						{server.name || server.description || server.dns}
					</a>
				);
			}
		});

		let voted = self.props.currentGatherer.serverVote !== null; 

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					{voted ? "Server Votes" : "Please Vote for a Server" }
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
			if (map.id === gatherer.mapVote) acc++;
			return acc;
		}, 0);
	},

	render() {
		var self = this;
		let maps = self.props.maps.map(map => {
			let votes = self.votesForMap(map);
			if (self.props.currentGatherer.mapVote === map.id) {
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

		let voted = (self.props.currentGatherer.mapVote !== null);

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					{ voted ? "Map Votes" : "Please Vote for a Map" }
				</div>
				<div className="list-group gather-voting">
					{maps}
				</div>
			</div>
		);
	}
})

var Gather = React.createClass({
	getDefaultProps() {
		return {
			gather: {
				gatherers: []
			}
		}
	},

	checkForStateChange: function (data) {
		let previousState = this.props.gather.state;
		let newState = data.gather.state;
		if (newState === previousState) return;

		// Callbacks for new states
		if (newState === "election" 
				&& previousState === "gathering"
				&& data.currentGatherer) {
			soundController.playGatherMusic();
		}
	},

	componentDidMount() {
		var self = this;
		socket.on("users:update", data => self.setProps({user: data.currentUser}));
		socket.on("gather:refresh", (data) => {
			self.checkForStateChange(data);
			self.setProps(data)
		});
	},
	
	render() {
		if (this.props.gather.state === 'done') {
			return (<CompletedGather {...this.props} />);
		}

		var voting;
		if (this.props.currentGatherer) {
			let state = this.props.gather.state;
			if (state === 'gathering' || state === 'election') {
				voting = (
					<div className="row add-top">
						<div className="col-sm-6">
							<MapVoting {...this.props} />
						</div>
						<div className="col-sm-6">
							<ServerVoting {...this.props} />
						</div>
					</div>
				);
			} else {
				voting = <GatherVotingResults gather={this.props.gather} servers={this.props.servers} maps={this.props.maps} />;
			}
		}

		var gatherTeams;
		if (this.props.gather.state === 'selection') {
			gatherTeams = <GatherTeams gather={this.props.gather} />
		}

		var previousGather;
		if (this.props.previousGather) {
			previousGather = (<CompletedGather {...this.props} gather={this.props.previousGather} />);
		}
		return (
			<div>
				<div className="panel panel-default add-bottom">
					<div className="panel-heading">Current Gather</div>
					<div className="panel-body">
						<GatherProgress {...this.props} />
					</div>
				</div>
				<Gatherers {...this.props} />
				{gatherTeams}
				{voting}
				<GatherActions {...this.props} />
				{previousGather}
			</div>
		);
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
		var self = this;
		var user = this.props.user;
		var admin = (user && user.admin);
		var gatherers = this.props.gather.gatherers
		.sort((a, b) => {
				return (b.user.hive.skill || 1000) - (a.user.hive.skill || 1000);
			})
		.map(gatherer => {
			if (gatherer.user.country) {
				var country = (<img src="images/blank.gif" 
												className={"flag flag-" + gatherer.user.country.toLowerCase()} 
												alt={gatherer.user.country} />);
			};

			var skill = gatherer.user.profile.skill || "Not Available";

			var abilities = [];
			for (let attr in gatherer.user.profile.abilities) {
				if (gatherer.user.profile.abilities[attr]) abilities.push(_.capitalize(attr));
			}

			var lifeform = (abilities.length) ? abilities.join(", ") : "None Specified";

			var hiveStats = [];
			if (gatherer.user.hive.skill) hiveStats.push(`${gatherer.user.hive.skill} ELO`);

			if (gatherer.user.hive.playTime) {
				hiveStats.push(`${Math.floor(gatherer.user.hive.playTime / 3600)} Hours`);
			}

			var hive = (hiveStats.length) ? hiveStats.join(", ") : "Not Available";
			
			var team = (gatherer.user.team) ? gatherer.user.team.name : "None";

			var action;
			if (self.props.gather.state === "election") {
				var votes = self.props.gather.gatherers.reduce((acc, voter) => {
					if (voter.leaderVote === gatherer.id) acc++;
					return acc;
				}, 0)
				action = (
					<span>
						<small>{votes + " votes"} &nbsp;</small>
						<VoteButton currentGatherer={self.props.currentGatherer} candidate={gatherer} />
					</span>
				);
			}

			if (self.props.gather.state === 'selection') {
				if (self.props.currentGatherer && 
						self.props.currentGatherer.leader &&
						self.props.currentGatherer.team === self.props.gather.pickingTurn) {
					action = (
						<span>
							<SelectPlayerButton gatherer={gatherer} />
						</span>
					);
				} else {
					if (gatherer.leader) {
						action = (<span className="label label-default">Leader</span>);
					} else if (gatherer.team !== "lobby") {
						action = (<span className="label label-primary">{gatherer.team}</span>);
					}
				}
			}

			var lifeformIcons;
			if (abilities.length) {
				lifeformIcons = abilities.map(function (ability) {
					return <img 
						className="lifeform-icon"
						alt={ability}
						src={`/images/${ability.toLowerCase()}.png`} />
				})
			}

			var adminOptions;
			if (admin) {
				adminOptions = [
					<dt>Admin</dt>,
					<dd>
						<button
							className="btn btn-xs btn-danger"
							value={gatherer.user.id}
							onClick={this.bootGatherer}>
							Boot from Gather
						</button>
					</dd>
				]
			}

			return (
				<div className="panel panel-success gatherer-panel" key={gatherer.user.id} data-userid={gatherer.user.id}>
					<div className="panel-heading">
						<h4 className="panel-title">
							<a data-toggle="collapse"
								href={"#"+gatherer.user.id.toString() + "-collapse"} 
								aria-expanded="false" 
								aria-controls={gatherer.user.id.toString() + "-collapse"}>
								{country} {gatherer.user.username} <span className="caret"></span>
							</a>
							<span className="pull-right">
								<span className="add-right">{lifeformIcons}</span>
								{action}
							</span>
						</h4>
					</div>
					<div id={gatherer.user.id.toString() + "-collapse"} 
						className="panel-collapse collapse out" >
						<div className="panel-body">
							<dl className="dl-horizontal">
								<dt>Lifeforms</dt>
								<dd>{lifeform}</dd>
								<dt>Skill Level</dt>
								<dd>{skill}</dd>
								<dt>Team</dt>
								<dd>{team}</dd>
								<dt>Hive Stats</dt>
								<dd>{hive}</dd>
								{adminOptions}
							</dl>
						</div>
					</div>
				</div>
			);
		})
		if (this.props.gather.gatherers.length) {
			return (
				<div class="panel-group" role="tablist" aria-multiselectable="true" id="gatherers-panel">
					{gatherers}
				</div>
			);
		} else {
			return (
				<div className="panel panel-default add-bottom">
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
	render() {
		return (
			<div id="previous_gather">
				<div className="panel panel-default add-bottom">
					<div className="panel-heading">Previous Gather</div>
				</div>
				<GatherTeams gather={this.props.gather} />
				<GatherVotingResults gather={this.props.gather} maps={this.props.maps} servers={this.props.servers}/>
			</div>
		);
	}
});

var GatherVotingResults = React.createClass({
	countVotes(voteType) {
		return this.props.gather.gatherers.reduce((acc, gatherer) => {
			if (gatherer[voteType] !== null) acc.push(gatherer[voteType]);
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
			<div className="panel panel-default">
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
						<a href={["steam://run/4920/connect", server.ip +":"+server.port, server.password].join("/")}
							className="btn btn-primary max-width">Click to Join</a>
					</p>
				</div>
			</div>
		);
	}
});
