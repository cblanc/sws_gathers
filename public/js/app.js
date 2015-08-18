"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var VoteButton = React.createClass({
	displayName: "VoteButton",

	cancelVote: function cancelVote(e) {
		socket.emit("gather:vote", {
			leader: {
				candidate: null
			}
		});
	},

	vote: function vote(e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			leader: {
				candidate: parseInt(e.target.value, 10)
			}
		});
	},

	render: function render() {
		if (this.props.currentGatherer === null) {
			return false;
		}
		if (this.props.currentGatherer.leaderVote === this.props.candidate.id) {
			return React.createElement(
				"button",
				{
					onClick: this.cancelVote,
					className: "btn btn-xs btn-success" },
				"Voted"
			);
		} else {
			return React.createElement(
				"button",
				{
					onClick: this.vote,
					className: "btn btn-xs btn-default",
					value: this.props.candidate.id },
				"Vote"
			);
		}
	}
});

var SelectPlayerButton = React.createClass({
	displayName: "SelectPlayerButton",

	selectPlayer: function selectPlayer(e) {
		e.preventDefault();
		socket.emit("gather:select", {
			player: parseInt(e.target.value, 10)
		});
	},

	render: function render() {
		if (this.props.gatherer.leader) {
			return React.createElement(
				"button",
				{
					className: "btn btn-xs btn-default",
					"data-disabled": "true" },
				"Leader"
			);
		} else if (this.props.gatherer.team !== "lobby") {
			return React.createElement(
				"button",
				{
					onClick: this.selectPlayer,
					value: this.props.gatherer.id,
					className: "btn btn-xs btn-default" },
				" Reselect"
			);
		} else {
			return React.createElement(
				"button",
				{
					onClick: this.selectPlayer,
					value: this.props.gatherer.id,
					className: "btn btn-xs btn-primary" },
				" Select"
			);
		}
	}
});

var GathererList = React.createClass({
	displayName: "GathererList",

	memberList: function memberList() {
		var self = this;
		return this.props.gather.gatherers.filter(function (gatherer) {
			return gatherer.team === self.props.team;
		}).sort(function (gatherer) {
			return gatherer.leader ? 1 : -1;
		});
	},

	render: function render() {
		var extractGatherer = function extractGatherer(gatherer) {
			var image;
			if (gatherer.leader) {
				image = React.createElement("img", { src: "/images/commander.png",
					alt: "Commander",
					height: "20",
					width: "20" });
			}
			return React.createElement(
				"tr",
				{ key: gatherer.id },
				React.createElement(
					"td",
					{ className: "col-md-1" },
					image
				),
				React.createElement(
					"td",
					{ className: "col-md-11" },
					gatherer.user.username
				)
			);
		};
		var members = this.memberList().map(extractGatherer);
		return React.createElement(
			"table",
			{ className: "table" },
			React.createElement(
				"tbody",
				null,
				members
			)
		);
	}
});

var GatherTeams = React.createClass({
	displayName: "GatherTeams",

	render: function render() {
		return React.createElement(
			"div",
			{ className: "panel-body" },
			React.createElement(
				"div",
				{ className: "row" },
				React.createElement(
					"div",
					{ className: "col-md-6" },
					React.createElement(
						"div",
						{ className: "panel panel-default" },
						React.createElement(
							"div",
							{ className: "panel-heading" },
							"Aliens"
						),
						React.createElement(GathererList, { gather: this.props.gather, team: "alien" })
					)
				),
				React.createElement(
					"div",
					{ className: "col-md-6" },
					React.createElement(
						"div",
						{ className: "panel panel-default" },
						React.createElement(
							"div",
							{ className: "panel-heading" },
							"Marines"
						),
						React.createElement(GathererList, { gather: this.props.gather, team: "marine" })
					)
				)
			)
		);
	}
});

var ElectionProgressBar = React.createClass({
	displayName: "ElectionProgressBar",

	componentDidMount: function componentDidMount() {
		var self = this;
		this.timer = setInterval(function () {
			self.forceUpdate();
		}, 900);
	},

	progress: function progress() {
		var interval = this.props.gather.election.interval;
		var startTime = new Date(this.props.gather.election.startTime).getTime();
		var msTranspired = Math.floor(new Date().getTime() - startTime);

		return {
			num: msTranspired,
			den: interval,
			barMessage: Math.floor((interval - msTranspired) / 1000) + "s remaining"
		};
	},

	componentWillUnmount: function componentWillUnmount() {
		clearInterval(this.timer);
	},

	render: function render() {
		return React.createElement(ProgressBar, { progress: this.progress() });
	}
});

var ProgressBar = React.createClass({
	displayName: "ProgressBar",

	render: function render() {
		var style = {
			width: Math.round(this.props.progress.num / this.props.progress.den * 100) + "%"
		};
		var barMessage = this.props.progress.barMessage || "";
		return React.createElement(
			"div",
			{ className: "progress" },
			React.createElement(
				"div",
				{ className: "progress-bar progress-bar-striped active",
					"data-role": "progressbar",
					"data-aria-valuenow": this.props.progress.num,
					"data-aria-valuemin": "0",
					"data-aria-valuemax": this.props.progress.den,
					style: style },
				barMessage
			)
		);
	}
});

var GatherProgress = React.createClass({
	displayName: "GatherProgress",

	stateDescription: function stateDescription() {
		switch (this.props.gather.state) {
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

	gatheringProgress: function gatheringProgress() {
		var num = this.props.gather.gatherers.length;
		var den = 12;
		var remaining = den - num;
		var message = remaining === 1 ? "Waiting for last player" : "Waiting for " + remaining + " more players";
		return {
			num: num,
			den: den,
			message: message
		};
	},

	electionProgress: function electionProgress() {
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

	selectionProgress: function selectionProgress() {
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

	render: function render() {
		var progress, progressBar;
		var gatherState = this.props.gather.state;
		if (gatherState === 'gathering' && this.props.gather.gatherers.length) {
			progress = this.gatheringProgress();
			progressBar = React.createElement(ProgressBar, { progress: progress });
		} else if (gatherState === 'election') {
			progress = this.electionProgress();
			progressBar = React.createElement(ElectionProgressBar, _extends({}, this.props, { progress: progress }));
		} else if (gatherState === 'selection') {
			progress = this.selectionProgress();
			progressBar = React.createElement(ProgressBar, { progress: progress });
		}

		if (!progress) return false;

		return React.createElement(
			"div",
			{ className: "panel-body no-bottom" },
			React.createElement(
				"p",
				null,
				React.createElement(
					"strong",
					null,
					this.stateDescription()
				),
				" ",
				progress.message
			),
			progressBar
		);
	}
});

var GatherActions = React.createClass({
	displayName: "GatherActions",

	joinGather: function joinGather(e) {
		e.preventDefault();
		socket.emit("gather:join");
	},

	leaveGather: function leaveGather(e) {
		e.preventDefault();
		socket.emit("gather:leave");
	},

	confirmTeam: function confirmTeam(e) {
		e.preventDefault();
		socket.emit("gather:select:confirm");
	},

	inviteToGather: function inviteToGather(e) {
		e.preventDefault();
		alert("Boop!");
	},

	render: function render() {
		var joinButton;
		if (this.props.currentGatherer) {
			joinButton = React.createElement(
				"li",
				null,
				React.createElement(
					"button",
					{
						onClick: this.leaveGather,
						className: "btn btn-danger" },
					"Leave Gather"
				)
			);
		} else if (this.props.gather.state === 'gathering') {
			joinButton = React.createElement(
				"button",
				{
					onClick: this.joinGather,
					className: "btn btn-success" },
				"Join Gather"
			);
		}

		var confirmTeam;
		if (this.props.currentGatherer && this.props.currentGatherer.leader && this.props.gather.state === 'selection' && this.props.gather.gatherers.every(function (gatherer) {
			return gatherer.team !== 'lobby';
		})) {
			if (this.props.currentGatherer.confirm) {
				confirmTeam = React.createElement(
					"li",
					null,
					React.createElement(
						"button",
						{
							className: "btn btn-default",
							"data-disabled": "true"
						},
						"Confirmed"
					)
				);
			} else {
				confirmTeam = React.createElement(
					"li",
					null,
					React.createElement(
						"button",
						{
							className: "btn btn-success",
							onClick: this.confirmTeam
						},
						"Confirm Team"
					)
				);
			}
		}

		var inviteButton;
		if (this.props.gather.state === 'gathering') {
			inviteButton = React.createElement(
				"li",
				null,
				React.createElement(
					"button",
					{
						onClick: this.inviteToGather,
						className: "btn btn-primary" },
					"Invite to Gather"
				)
			);
		}

		return React.createElement(
			"div",
			{ className: "panel-footer text-right" },
			React.createElement(
				"ul",
				{ className: "list-inline no-bottom" },
				confirmTeam,
				inviteButton,
				joinButton
			)
		);
	}
});

var ServerVoting = React.createClass({
	displayName: "ServerVoting",

	handleServerVote: function handleServerVote(e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			server: {
				id: parseInt(e.target.value, 10)
			}
		});
	},

	votesForServer: function votesForServer(server) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (server.id === gatherer.serverVote) acc++;
			return acc;
		}, 0);
	},

	render: function render() {
		var self = this;
		var servers = self.props.servers.map(function (server) {
			var voteButton;
			if (self.props.currentGatherer.serverVote === server.id) {
				voteButton = React.createElement(
					"button",
					{
						"data-disabled": "true",
						className: "btn btn-xs btn-success" },
					"Voted"
				);
			} else {
				voteButton = React.createElement(
					"button",
					{
						onClick: self.handleServerVote,
						value: server.id,
						className: "btn btn-xs btn-primary" },
					"Vote"
				);
			}
			return React.createElement(
				"tr",
				{ key: server.id },
				React.createElement(
					"td",
					{ className: "col-md-6" },
					server.description || server.dns
				),
				React.createElement(
					"td",
					{ className: "col-md-6 text-right" },
					self.votesForServer(server),
					" Votes ",
					voteButton
				)
			);
		});
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Server Voting"
			),
			React.createElement(
				"table",
				{ id: "serverVoteTable", className: "table table-condensed table-hover voting-table" },
				servers
			)
		);
	}
});

var MapVoting = React.createClass({
	displayName: "MapVoting",

	handleMapVote: function handleMapVote(e) {
		e.preventDefault();
		socket.emit("gather:vote", {
			map: {
				id: parseInt(e.target.value, 10)
			}
		});
	},

	votesForMap: function votesForMap(map) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (map.id === gatherer.mapVote) acc++;
			return acc;
		}, 0);
	},

	render: function render() {
		var self = this;
		var maps = self.props.maps.map(function (map) {
			var voteButton;
			if (self.props.currentGatherer.mapVote === map.id) {
				voteButton = React.createElement(
					"button",
					{
						"data-disabled": "true",
						className: "btn btn-xs btn-success" },
					"Voted"
				);
			} else {
				voteButton = React.createElement(
					"button",
					{
						onClick: self.handleMapVote,
						value: map.id,
						className: "btn btn-xs btn-primary" },
					"Vote"
				);
			}
			return React.createElement(
				"tr",
				{ key: map.id },
				React.createElement(
					"td",
					{ className: "col-md-6" },
					map.name
				),
				React.createElement(
					"td",
					{ className: "col-md-6 text-right" },
					self.votesForMap(map),
					" Votes ",
					voteButton
				)
			);
		});
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Map Voting"
			),
			React.createElement(
				"table",
				{ className: "table table-condensed table-hover voting-table" },
				maps
			)
		);
	}
});

var Gather = React.createClass({
	displayName: "Gather",

	getDefaultProps: function getDefaultProps() {
		return {
			gather: {
				gatherers: []
			}
		};
	},

	componentDidMount: function componentDidMount() {
		var self = this;
		socket.on("gather:refresh", function (data) {
			return self.setProps(data);
		});
	},

	render: function render() {
		if (this.props.gather.state === 'done') {
			return React.createElement(CompletedGather, this.props);
		}

		var voting;
		if (this.props.currentGatherer) {
			voting = React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "row" },
					React.createElement(
						"div",
						{ className: "col-md-6" },
						React.createElement(MapVoting, this.props)
					),
					React.createElement(
						"div",
						{ className: "col-md-6" },
						React.createElement(ServerVoting, this.props)
					)
				)
			);
		}

		var gatherTeams;
		if (this.props.gather.state === 'selection') {
			gatherTeams = React.createElement(GatherTeams, { gather: this.props.gather });
		}

		var previousGather;
		if (this.props.previousGather) {
			previousGather = React.createElement(CompletedGather, _extends({}, this.props, { gather: this.props.previousGather }));
		}
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "panel panel-default" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					React.createElement(
						"strong",
						null,
						"Current Gather"
					),
					React.createElement(
						"span",
						{ className: "badge add-left" },
						this.props.gather.gatherers.length
					)
				),
				React.createElement(GatherProgress, this.props),
				React.createElement(Gatherers, this.props),
				gatherTeams,
				voting,
				React.createElement(GatherActions, this.props)
			),
			previousGather
		);
	}
});

var Gatherers = React.createClass({
	displayName: "Gatherers",

	joinGather: function joinGather(e) {
		e.preventDefault();
		socket.emit("gather:join");
	},

	render: function render() {
		var self = this;
		var gatherers = this.props.gather.gatherers.map(function (gatherer) {

			// Country
			var country;

			if (gatherer.user.country) {
				country = React.createElement("img", { src: "images/blank.gif",
					className: "flag flag-" + gatherer.user.country.toLowerCase(),
					alt: gatherer.user.country });
			};

			var division = React.createElement(
				"span",
				{ className: "label label-primary" },
				gatherer.user.ability.division
			);
			var lifeform = gatherer.user.ability.lifeforms.map(function (lifeform) {
				return React.createElement(
					"span",
					{ className: "label label-default",
						key: [lifeform, gatherer.id].join("-") },
					lifeform
				);
			});
			var team;

			if (gatherer.user.team) {
				team = React.createElement(
					"span",
					{ className: "label label-primary" },
					gatherer.user.team.name
				);
			}

			var action;

			if (self.props.gather.state === "election") {
				var votes = self.props.gather.gatherers.reduce(function (acc, voter) {
					if (voter.leaderVote === gatherer.id) acc++;
					return acc;
				}, 0);
				action = React.createElement(
					"span",
					null,
					React.createElement(
						"small",
						null,
						votes + " votes",
						"  "
					),
					React.createElement(VoteButton, { currentGatherer: self.props.currentGatherer, candidate: gatherer })
				);
			}

			if (self.props.gather.state === 'selection') {
				if (self.props.currentGatherer && self.props.currentGatherer.leader) {
					action = React.createElement(
						"span",
						null,
						React.createElement(SelectPlayerButton, { gatherer: gatherer })
					);
				} else {
					if (gatherer.team !== "lobby") {
						action = React.createElement(
							"span",
							{ className: "label label-success" },
							gatherer.team
						);
					}
				}
			}

			return React.createElement(
				"tr",
				{ key: gatherer.user.id, "data-userid": gatherer.user.id },
				React.createElement(
					"td",
					{ className: "col-md-5" },
					country,
					" ",
					gatherer.user.username,
					" "
				),
				React.createElement(
					"td",
					{ className: "col-md-5" },
					lifeform,
					" ",
					division,
					" ",
					team,
					" "
				),
				React.createElement(
					"td",
					{ className: "col-md-2 text-right" },
					action,
					" "
				)
			);
		});
		if (this.props.gather.gatherers.length) {
			return React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"div",
					{ className: "panel panel-default" },
					React.createElement(
						"table",
						{ className: "table roster-table" },
						React.createElement(
							"tbody",
							null,
							gatherers
						)
					)
				)
			);
		} else {
			return React.createElement(
				"div",
				{ className: "panel-body text-center join-hero" },
				React.createElement(
					"button",
					{
						onClick: this.joinGather,
						className: "btn btn-success btn-lg" },
					"Start a Gather"
				)
			);
		}
	}
});

var CompletedGather = React.createClass({
	displayName: "CompletedGather",

	countVotes: function countVotes(voteType) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer[voteType] !== null) acc.push(gatherer[voteType]);
			return acc;
		}, []);
	},

	selectedMaps: function selectedMaps() {
		return rankVotes(this.countVotes('mapVote'), this.props.maps).slice(0, 2);
	},

	selectedServer: function selectedServer() {
		return rankVotes(this.countVotes('serverVote'), this.props.servers).slice(0, 1);
	},

	render: function render() {
		var maps = this.selectedMaps();
		var server = this.selectedServer().pop();
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				React.createElement(
					"strong",
					null,
					"Previous Gather"
				)
			),
			React.createElement(GatherTeams, { gather: this.props.gather }),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"dl",
					{ className: "dl-horizontal" },
					React.createElement(
						"dt",
						null,
						"Maps"
					),
					React.createElement(
						"dd",
						null,
						maps.map(function (map) {
							return map.name;
						}).join(" & ")
					),
					React.createElement(
						"dt",
						null,
						"Server"
					),
					React.createElement(
						"dd",
						null,
						server.name
					),
					React.createElement(
						"dt",
						null,
						"Address"
					),
					React.createElement(
						"dd",
						null,
						server.ip,
						":",
						server.port
					),
					React.createElement(
						"dt",
						null,
						"Password"
					),
					React.createElement(
						"dd",
						null,
						server.password
					),
					React.createElement("br", null),
					React.createElement(
						"dt",
						null,
						" "
					),
					React.createElement(
						"dd",
						null,
						React.createElement(
							"a",
							{ href: ["steam://run/4920/connect", server.ip + ":" + server.port, server.password].join("/"),
								className: "btn btn-primary" },
							"Click to Join"
						)
					)
				)
			)
		);
	}
});

"use strict";

var socket;

var initialiseVisibilityMonitoring = function initialiseVisibilityMonitoring(socket) {
	var hidden = undefined,
	    visibilityChange = undefined;
	if (typeof document.hidden !== "undefined") {
		// Opera 12.10 and Firefox 18 and later support
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}

	document.addEventListener(visibilityChange, function () {
		if (document[hidden]) {
			socket.emit("users:away");
		} else {
			socket.emit("users:online");
		}
	}, false);
};

var removeAuthWidget = function removeAuthWidget() {
	$("#authenticating").remove();
};

var showAuthenticationNotice = function showAuthenticationNotice() {
	$("#auth-required").show();
};

var renderPage = function renderPage(socket) {
	initialiseVisibilityMonitoring(socket);
	React.render(React.createElement(UserMenu, null), document.getElementById('side-menu'));
	React.render(React.createElement(Chatroom, null), document.getElementById('chatroom'));
	React.render(React.createElement(Gather, null), document.getElementById('gathers'));
	React.render(React.createElement(CurrentUser, null), document.getElementById('currentuser'));
	React.render(React.createElement(AdminPanel, null), document.getElementById('admin-menu'));
};

var initialiseComponents = function initialiseComponents() {
	var socketUrl = window.location.protocol + "//" + window.location.host;
	socket = io(socketUrl).on("connect", function () {
		console.log("Connected");
		removeAuthWidget();
		renderPage(socket);
	}).on("error", function (error, foo) {
		console.log(error);
		if (error === "Authentication Failed") {
			removeAuthWidget();
			showAuthenticationNotice();
		}
	}).on("reconnect", function () {
		console.log("Reconnected");
	}).on("disconnect", function () {
		console.log("Disconnected");
	});
};

"use strict";

var Chatroom = React.createClass({
	displayName: "Chatroom",

	getDefaultProps: function getDefaultProps() {
		return {
			history: []
		};
	},

	componentDidMount: function componentDidMount() {
		var self = this;

		socket.on("message:new", function (data) {
			var history = self.props.history;
			history.push(data);
			self.setProps({
				history: history
			});
			self.scrollToBottom();
		});

		// Message History Retrieved
		socket.on("message:refresh", function (data) {
			self.setProps({
				history: data.chatHistory
			});
			self.scrollToBottom();
		});

		socket.emit("message:refresh", {});
	},

	sendMessage: function sendMessage(message) {
		socket.emit("newMessage", { message: message });
	},

	scrollToBottom: function scrollToBottom() {
		var node = React.findDOMNode(this.refs.messageContainer);
		node.scrollTop = node.scrollHeight;
	},

	render: function render() {
		var messages = this.props.history.map(function (message) {
			return React.createElement(ChatMessage, { message: message, key: message.id });
		});
		return React.createElement(
			"div",
			{ className: "panel panel-default" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Gather Chat"
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"ul",
					{ className: "chat", id: "chatmessages", ref: "messageContainer" },
					messages
				)
			),
			React.createElement(
				"div",
				{ className: "panel-footer" },
				React.createElement(MessageBar, null)
			)
		);
	}
});

var updateMessageCallbacks = [];

var timer = setInterval(function () {
	updateMessageCallbacks.forEach(function (callback) {
		return callback();
	});
}, 60000);

var ChatMessage = React.createClass({
	displayName: "ChatMessage",

	componentDidMount: function componentDidMount() {
		var self = this;
		updateMessageCallbacks.push(function () {
			self.forceUpdate();
		});
	},

	render: function render() {
		return React.createElement(
			"li",
			{ className: "left clearfix" },
			React.createElement(
				"span",
				{ className: "chat-img pull-left" },
				React.createElement("img", {
					src: this.props.message.author.avatar,
					alt: "User Avatar",
					height: "40",
					width: "40",
					className: "img-circle" })
			),
			React.createElement(
				"div",
				{ className: "chat-body clearfix" },
				React.createElement(
					"div",
					{ className: "header" },
					React.createElement(
						"strong",
						{ className: "primary-font" },
						this.props.message.author.username
					),
					React.createElement(
						"small",
						{ className: "pull-right text-muted" },
						React.createElement("i", { className: "fa fa-clock-o fa-fw" }),
						" ",
						$.timeago(this.props.message.createdAt)
					)
				),
				React.createElement(
					"p",
					null,
					this.props.message.content
				)
			)
		);
	}
});

var MessageBar = React.createClass({
	displayName: "MessageBar",

	sendMessage: function sendMessage(content) {
		socket.emit("message:new", {
			content: content
		});
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
		var content = React.findDOMNode(this.refs.content).value.trim();
		if (!content) return;
		React.findDOMNode(this.refs.content).value = '';
		this.sendMessage(content);
		return;
	},

	render: function render() {
		return React.createElement(
			"form",
			{ onSubmit: this.handleSubmit },
			React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement("input", {
					id: "btn-input",
					type: "text",
					className: "form-control",
					ref: "content",
					placeholder: "Be polite please..." }),
				React.createElement(
					"span",
					{ className: "input-group-btn" },
					React.createElement("input", {
						type: "submit",
						className: "btn btn-primary",
						id: "btn-chat",
						value: "Send" })
				)
			)
		);
	}
});

"use strict";

var UserLogin = React.createClass({
	displayName: "UserLogin",

	authorizeId: function authorizeId(id) {
		socket.emit("users:authorize", {
			id: parseInt(id, 10)
		});
		setTimeout(function () {
			socket.emit("gather:refresh");
		}, 1000);
	},

	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
		var id = React.findDOMNode(this.refs.authorize_id).value.trim();
		if (!id) return;
		React.findDOMNode(this.refs.authorize_id).value = '';
		this.authorizeId(id);
	},

	render: function render() {
		return React.createElement(
			"form",
			{ onSubmit: this.handleSubmit },
			React.createElement(
				"div",
				{ className: "input-group signin" },
				React.createElement("input", {
					id: "btn-input",
					type: "text",
					className: "form-control",
					ref: "authorize_id",
					placeholder: "Change user" }),
				React.createElement(
					"span",
					{ className: "input-group-btn" },
					React.createElement("input", {
						type: "submit",
						className: "btn btn-primary",
						id: "btn-chat",
						value: "Assume ID" })
				)
			)
		);
	}
});

var UserMenu = React.createClass({
	displayName: "UserMenu",

	getDefaultProps: function getDefaultProps() {
		return {
			users: []
		};
	},

	componentDidMount: function componentDidMount() {
		var self = this;
		socket.on('users:update', function (data) {
			return self.setProps({ users: data.users });
		});
	},

	render: function render() {
		var users = this.props.users.map(function (user) {
			return React.createElement(
				"li",
				{ key: user.id },
				React.createElement(
					"a",
					{ href: "#" },
					user.username
				)
			);
		});
		return React.createElement(
			"ul",
			{ className: "nav", id: "side-menu" },
			React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#" },
					React.createElement("i", { className: "fa fa-users fa-fw" }),
					" Online",
					React.createElement(
						"span",
						{ className: "badge add-left" },
						" ",
						this.props.users.length,
						" "
					)
				)
			),
			users
		);
	}
});

var AdminPanel = React.createClass({
	displayName: "AdminPanel",

	handleGatherReset: function handleGatherReset() {
		socket.emit("gather:reset");
	},

	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"h5",
				null,
				"Swap Into a Different Account"
			),
			React.createElement(UserLogin, null),
			React.createElement(
				"h5",
				null,
				"Gather Options"
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"button",
					{
						className: "btn btn-danger max-width",
						onClick: this.handleGatherReset },
					"Reset Gather"
				)
			)
		);
	}
});

var CurrentUser = React.createClass({
	displayName: "CurrentUser",

	componentDidMount: function componentDidMount() {
		var self = this;
		socket.on("users:update", function (data) {
			return self.setProps({ user: data.currentUser });
		});
		socket.emit("users:refresh");
	},

	render: function render() {
		if (this.props.user) {
			var adminOptions;
			if (this.props.user.admin) {
				adminOptions = React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ href: "#", "data-toggle": "modal", "data-target": "#adminmodal" },
						"Administration"
					)
				);
			}
			return React.createElement(
				"li",
				{ className: "dropdown" },
				React.createElement(
					"a",
					{ className: "dropdown-toggle", "data-toggle": "dropdown", href: "#" },
					this.props.user.username,
					"  ",
					React.createElement("img", { src: this.props.user.avatar,
						alt: "User Avatar",
						height: "20",
						width: "20" }),
					" ",
					React.createElement("i", { className: "fa fa-caret-down" })
				),
				React.createElement(
					"ul",
					{ className: "dropdown-menu dropdown-user" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#" },
							React.createElement("i", { className: "fa fa-gear fa-fw" }),
							" Profile"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#" },
							React.createElement("i", { className: "fa fa-flag fa-fw" }),
							" Notifications"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#" },
							React.createElement("i", { className: "fa fa-music fa-fw" }),
							" Sounds"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#", "data-toggle": "modal", "data-target": "#designmodal" },
							"Design Goals"
						)
					),
					adminOptions
				)
			);
		} else {
			return false;
		}
	}
});