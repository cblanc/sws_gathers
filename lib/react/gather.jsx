"use strict";

var VoteButton = React.createClass({
	cancelVote: function (e) {
		socket.emit("gather:vote", {
			leader: {
				candidate: null
			}
		});
	},
	vote: function (e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			leader: {
				candidate: parseInt(e.target.value, 10)
			}
		});
	},
	render: function () {
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
					className="btn btn-xs btn-default"
					value={this.props.candidate.id}>Vote
				</button>
			);
		}
	}
});

var SelectPlayerButton = React.createClass({
	selectPlayer: function (e) {
		e.preventDefault();
		socket.emit("gather:select", {
			player: parseInt(e.target.value, 10)
		})
	},
	render: function () {
		if (this.props.gatherer.leader) {
			return (<button 
				className="btn btn-xs btn-default"
				data-disabled="true">Leader</button>);
		} else {
			return (<button
				onClick={this.selectPlayer}
				value={this.props.gatherer.id}
				className="btn btn-xs btn-primary"> Select
				</button>
			);
		}
	}
});

var GatherTeams = React.createClass({
	alienGatherers: function () {
		return this.props.gather.gatherers.filter(function (gatherer) {
			return gatherer.team === "alien";
		}).sort(function (gatherer) {
			return (gatherer.leader) ? 1 : -1;
		});
	},
	marineGatherers: function () {
		return this.props.gather.gatherers.filter(function (gatherer) {
			return gatherer.team === "marine";
		}).sort(function (gatherer) {
			return (gatherer.leader) ? 1 : -1;
		});
	},
	render: function () {
		var extractGatherer = function (gatherer) {
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
		var marines = this.marineGatherers().map(extractGatherer);
		var aliens = this.alienGatherers().map(extractGatherer);
		return (
			<div className="panel-body">
				<div className="row">
					<div className="col-md-6">
						<div className="panel panel-default">
							<div className="panel-heading">
								Aliens
							</div>
							<table className="table">
								<tbody>
									{aliens}
								</tbody>
							</table>
						</div>
					</div>
					<div className="col-md-6">
						<div className="panel panel-default">
							<div className="panel-heading">
								Marines
							</div>
							<table className="table">
								<tbody>
									{marines}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
})

var GatherProgress = React.createClass({
	stateDescription: function () {
		switch(this.props.gather.state) {
			case "gathering":
				return "Waiting for more gatherers.";
			case "election":
				return "Currently voting for team leaders.";
			case "selection":
				return "Waiting for leaders to picking teams.";
			case "done":
				return "Gather completed.";
			default:
				return "Initialising gather.";
		}
	},
	gatheringProgress: function () {
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
	electionProgress: function () {
		var num = this.props.gather.gatherers.reduce(function (acc, gatherer) {
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
	selectionProgress: function () {
		var num = this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer.team !== "lobby") acc++;
			return acc;
		}, 0);
		var den = 12;

		return {
			num: num,
			den: den,
			message: num + " out of " + den + " players assigned"
		};
	},
	render: function () {
		var progress;
		var gatherState = this.props.gather.state;
		if (gatherState === 'gathering' && this.props.gather.gatherers.length) {
			progress = this.gatheringProgress();
		} else if (gatherState === 'election') {
			progress = this.electionProgress();
		} else if (gatherState === 'selection') {
			progress = this.selectionProgress();
		}
		if (progress) {
			var style = {
				width: Math.round((progress.num / progress.den * 100)) + "%"
			};
			return (
				<div className="panel-body no-bottom">
					<p><strong>{this.stateDescription()}</strong> {progress.message}</p>
					<div className="progress">
					  <div className="progress-bar progress-bar-striped active" 
					  	data-role="progressbar" 
					  	data-aria-valuenow={progress.num} 
					  	data-aria-valuemin="0" 
					  	data-aria-valuemax={progress.den} 
					  	style={style}>
					  </div>
				  </div>
				</div>
			);
		} else {
			return false;
		}
	}
});

var GatherActions = React.createClass({
	joinGather: function (e) {
		e.preventDefault();
		socket.emit("gather:join");
	},
	leaveGather: function (e) {
		e.preventDefault();
		socket.emit("gather:leave");
	},
	confirmTeam: function (e) {
		e.preventDefault();
		socket.emit("gather:select:confirm");
	},
	inviteToGather: function (e) {
		e.preventDefault();
		alert("Boop!");
	},
	render: function () {
		var joinButton;
		if (this.props.currentGatherer) {
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

		var confirmTeam;
		if (this.props.currentGatherer &&
					this.props.currentGatherer.leader &&
					this.props.gather.state === 'selection' &&
					this.props.gather.gatherers.every(function (gatherer) {
						return gatherer.team !== 'lobby';
					}) ) {
			if (this.props.currentGatherer.confirm) {
				confirmTeam = (
					<li>
						<button
							className="btn btn-default"
							data-disabled="true"
							>
							Confirmed
						</button>
					</li>
				);
			} else {
				confirmTeam = (
					<li>
					<button
						className="btn btn-success"
						onClick={this.confirmTeam}
						>
						Confirm Team
					</button>
					</li>
				);
			}
		}

		var inviteButton;
		if (this.props.gather.state === 'gathering') {
			inviteButton = (<li><button
							onClick={this.inviteToGather}
							className="btn btn-primary">Invite to Gather</button></li>);
		}

		return (
			<div className="panel-footer text-right">
				<ul className="list-inline no-bottom">
					{confirmTeam}
					{inviteButton}
					{joinButton}
				</ul>
			</div>
		);
	}
});

var ServerVoting = React.createClass({
	handleServerVote: function (e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			server: {
				id: parseInt(e.target.value, 10)
			}
		});
	},
	votesForServer: function (server) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (server.id === gatherer.serverVote) acc++;
			return acc;
		}, 0);
	},
	render: function () {
		var self = this;
		var servers = self.props.servers.map(function (server) {
			var voteButton;
			if (self.props.currentGatherer.serverVote === server.id) {
				voteButton = (<button
											data-disabled="true"
											className="btn btn-xs btn-success">
											Voted</button>)
			} else {
				voteButton = (<button
											onClick={self.handleServerVote}
											value={server.id}
											className="btn btn-xs btn-primary">
											Vote</button>);
			}
			return (
				<tr>
					<td className="col-md-6">{server.name}</td>
					<td className="col-md-3">{self.votesForServer(server)} Votes</td>
					<td className="col-md-3 text-right">
						{voteButton}
					</td>
				</tr>
			);
		});
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Server Voting
				</div>
				<table id="serverVoteTable" className="table table-condensed table-hover voting-table">
					{servers}
				</table>
			</div>
		);
	}
})

var MapVoting = React.createClass({
	handleMapVote: function (e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			map: {
				id: parseInt(e.target.value, 10)
			}
		});
	},
	votesForMap: function (map) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (map.id === gatherer.mapVote) acc++;
			return acc;
		}, 0);
	},
	render: function () {
		var self = this;
		var maps = self.props.maps.map(function (map) {
			var voteButton;
			if (self.props.currentGatherer.mapVote === map.id) {
				voteButton = (<button
											data-disabled="true"
											className="btn btn-xs btn-success">
											Voted</button>)
			} else {
				voteButton = (<button
											onClick={self.handleMapVote}
											value={map.id}
											className="btn btn-xs btn-primary">
											Vote</button>);
			}
			return (
				<tr>
					<td className="col-md-6">{map.name}</td>
					<td className="col-md-3">{self.votesForMap(map)} Votes</td>
					<td className="col-md-3 text-right">
						{voteButton}
					</td>
				</tr>
			);
		});
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Map Voting
				</div>
				<table className="table table-condensed table-hover voting-table">
					{maps}
				</table>
			</div>
		);
	}
})

var Gather = React.createClass({
	getDefaultProps: function () {
		return {
			gather: {
				gatherers: []
			}
		}
	},
	componentDidMount: function () {
		var self = this;
		socket.on("gather:refresh", function (data) {
			self.setProps(data);
		});
	},
	
	render: function () {
		if (this.props.gather.state === 'done') {
			return (<CompletedGather {...this.props} />);
		}

		var voting;
		if (this.props.currentGatherer) {
			voting = (
				<div className="panel-body">
					<div className="row">
						<div className="col-md-6">
							<MapVoting {...this.props} />
						</div>
						<div className="col-md-6">
							<ServerVoting {...this.props} />
						</div>
					</div>
				</div>
			);
		}

		var gatherTeams;
		if (this.props.gather.state === 'selection') {
			gatherTeams = <GatherTeams gather={this.props.gather} />
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<strong>NS2 Gather </strong>
					<span className="badge add-left">{this.props.gather.gatherers.length}</span>
				</div>
				<GatherProgress gather={this.props.gather} />
				<Gatherers gather={this.props.gather} currentGatherer={this.props.currentGatherer} />
				{gatherTeams}
				{voting}
				<GatherActions {...this.props} />
			</div>
		);
	}
});

var Gatherers = React.createClass({
	joinGather: function (e) {
		e.preventDefault();
		socket.emit("gather:join");
	},
	render: function () {
		var self = this;
		var gatherers = this.props.gather.gatherers.map(function (gatherer) {
			// Switch this to online status
			var online= (<div className="dot online"></div>);

			var division = (<span className="label label-primary">{gatherer.user.ability.division}</span>);
			var action;

			if (self.props.gather.state === 'gathering') {
				action = (
					gatherer.user.ability.lifeforms.map(function (lifeform) {
						return (<span className="label label-default">{lifeform}</span>);
					})
				);
			}

			if (self.props.gather.state === "election") {
				var votes = self.props.gather.gatherers.reduce(function (acc, voter) {
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
				action = (
					<span>
						<SelectPlayerButton gatherer={gatherer} />
					</span>
				);
			}

			return (
				<tr key={gatherer.user.id}>
					<td className="col-md-6">{online} {gatherer.user.username}</td>
					<td className="col-md-3">{division}&nbsp;</td>
					<td className="col-md-3 text-right">{action}&nbsp;</td>
				</tr>
			);
		})
		if (this.props.gather.gatherers.length) {
			return (
				<div className="panel-body">
					<div className="panel panel-default">
						<table className="table roster-table">
							<tbody>
								{gatherers}
							</tbody>
						</table>
					</div>
				</div>
			);
		} else {
			return (
				<div className="panel-body text-center join-hero">
					<button 
						onClick={this.joinGather} 
						className="btn btn-success btn-lg">Start a Gather</button>
				</div>
			);
		}
	}
});

var CompletedGather = React.createClass({
	votedMaps: function () {
		var maps = this.props.maps;
		var mapVotes = this.props.gather.gatherers.map(function (gatherer) {
			return gatherer.mapVote;
		}).filter(function (elem) {
			return elem !== null;
		}).map(function (mapId) {
			var result;
			maps.forEach(function (map) {
				if (map.id === mapId) result = map;
			});
			return result;
		});
	},
	votedServer: function () {

	},
	render: function () {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<strong>Gather Completed</strong>
				</div>
				<div className="panel-body">
					<h3>Join Up:</h3>
					<p>{this.votedMaps()
									.map(function (map) {return map.name})
									.join(",")}</p>
				</div>
				<GatherTeams gather={this.props.gather} />
			</div>
		);
	}
});


