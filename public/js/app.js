"use strict";

var VoteButton = React.createClass({displayName: "VoteButton",
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
				React.createElement("button", {
					onClick: this.cancelVote, 
					className: "btn btn-xs btn-success"}, "Voted"
				)
			);
		} else {
			return (
				React.createElement("button", {
					onClick: this.vote, 
					className: "btn btn-xs btn-default", 
					value: this.props.candidate.id}, "Vote"
				)
			);
		}
	}
});

var JoinGatherButton = React.createClass({displayName: "JoinGatherButton",
	joinGather: function (e) {
		e.preventDefault();
		socket.emit("gather:join", {});
	},
	render: function () {
		var message = this.props.buttonName || "Join Gather";
		var buttonClass = "btn btn-success";
		if (this.props.buttonClass) {
			buttonClass += " " + this.props.buttonClass;
		}
		return (React.createElement("button", {
							onClick: this.joinGather, 
							className: buttonClass}, message))
	}
});

var SelectPlayerButton = React.createClass({displayName: "SelectPlayerButton",
	selectPlayer: function (e) {
		e.preventDefault();
		socket.emit("gather:select", {
			player: parseInt(e.target.value, 10)
		})
	},
	render: function () {
		if (this.props.gatherer.leader) {
			return (React.createElement("button", {
				className: "btn btn-xs btn-default", 
				"data-disabled": "true"}, "Leader"));
		} else {
			return (React.createElement("button", {
				onClick: this.selectPlayer, 
				value: this.props.gatherer.id, 
				className: "btn btn-xs btn-primary"}, " Select"
				)
			);
		}
	}
});

var GatherTeams = React.createClass({displayName: "GatherTeams",
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
				image = (React.createElement("img", {src: "/images/commander.png", 
					alt: "Commander", 
					height: "20", 
					width: "20"}));
			}
			return (
				React.createElement("tr", {key: gatherer.id}, 
					React.createElement("td", {className: "col-md-1"}, image), 
					React.createElement("td", {className: "col-md-11"}, gatherer.user.username)
				)
			);
		}
		var marines = this.marineGatherers().map(extractGatherer);
		var aliens = this.alienGatherers().map(extractGatherer);
		return (
			React.createElement("div", {className: "panel-body"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-md-6"}, 
						React.createElement("div", {className: "panel panel-default"}, 
							React.createElement("div", {className: "panel-heading"}, 
								"Aliens"
							), 
							React.createElement("table", {className: "table"}, 
								React.createElement("tbody", null, 
									aliens
								)
							)
						)
					), 
					React.createElement("div", {className: "col-md-6"}, 
						React.createElement("div", {className: "panel panel-default"}, 
							React.createElement("div", {className: "panel-heading"}, 
								"Marines"
							), 
							React.createElement("table", {className: "table"}, 
								React.createElement("tbody", null, 
									marines
								)
							)
						)
					)
				)
			)
		);
	}
})

var GatherProgress = React.createClass({displayName: "GatherProgress",
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
				React.createElement("div", {className: "panel-body no-bottom"}, 
					React.createElement("p", null, React.createElement("strong", null, this.stateDescription()), " ", progress.message), 
					React.createElement("div", {className: "progress"}, 
					  React.createElement("div", {className: "progress-bar progress-bar-striped active", 
					  	"data-role": "progressbar", 
					  	"data-aria-valuenow": progress.num, 
					  	"data-aria-valuemin": "0", 
					  	"data-aria-valuemax": progress.den, 
					  	style: style}
					  )
				  )
				)
			);
		} else {
			return false;
		}
	}
});

var GatherActions = React.createClass({displayName: "GatherActions",
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
	},
	render: function () {
		var joinButton;
		if (this.props.currentGatherer) {
			joinButton = (React.createElement("li", null, React.createElement("button", {
							onClick: this.leaveGather, 
							className: "btn btn-danger"}, "Leave Gather")));
		} else {
			joinButton = (React.createElement("li", null, React.createElement(JoinGatherButton, null)));
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
					React.createElement("li", null, 
						React.createElement("button", {
							className: "btn btn-default", 
							"data-disabled": "true"
							}, 
							"Confirmed"
						)
					)
				);
			} else {
				confirmTeam = (
					React.createElement("li", null, 
					React.createElement("button", {
						className: "btn btn-success", 
						onClick: this.confirmTeam
						}, 
						"Confirm Team"
					)
					)
				);
			}
		}

		var inviteButton;
		if (this.props.gather.state === 'gathering') {
			inviteButton = (React.createElement("li", null, React.createElement("button", {
							onClick: this.inviteToGather, 
							className: "btn btn-primary"}, "Invite to Gather")));
		}

		return (
			React.createElement("div", {className: "panel-footer text-right"}, 
				React.createElement("ul", {className: "list-inline no-bottom"}, 
					confirmTeam, 
					inviteButton, 
					joinButton
				)
			)
		);
	}
});

var ServerVoting = React.createClass({displayName: "ServerVoting",
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
				voteButton = (React.createElement("button", {
											"data-disabled": "true", 
											className: "btn btn-xs btn-success"}, 
											"Voted"))
			} else {
				voteButton = (React.createElement("button", {
											onClick: self.handleServerVote, 
											value: server.id, 
											className: "btn btn-xs btn-primary"}, 
											"Vote"));
			}
			return (
				React.createElement("tr", null, 
					React.createElement("td", {className: "col-md-6"}, server.name), 
					React.createElement("td", {className: "col-md-3"}, self.votesForServer(server), " Votes"), 
					React.createElement("td", {className: "col-md-3 text-right"}, 
						voteButton
					)
				)
			);
		});
		return (
			React.createElement("div", {className: "panel panel-default"}, 
				React.createElement("div", {className: "panel-heading"}, 
					"Server Voting"
				), 
				React.createElement("table", {id: "serverVoteTable", className: "table table-condensed table-hover voting-table"}, 
					servers
				)
			)
		);
	}
})

var MapVoting = React.createClass({displayName: "MapVoting",
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
				voteButton = (React.createElement("button", {
											"data-disabled": "true", 
											className: "btn btn-xs btn-success"}, 
											"Voted"))
			} else {
				voteButton = (React.createElement("button", {
											onClick: self.handleMapVote, 
											value: map.id, 
											className: "btn btn-xs btn-primary"}, 
											"Vote"));
			}
			return (
				React.createElement("tr", null, 
					React.createElement("td", {className: "col-md-6"}, map.name), 
					React.createElement("td", {className: "col-md-3"}, self.votesForMap(map), " Votes"), 
					React.createElement("td", {className: "col-md-3 text-right"}, 
						voteButton
					)
				)
			);
		});
		return (
			React.createElement("div", {className: "panel panel-default"}, 
				React.createElement("div", {className: "panel-heading"}, 
					"Map Voting"
				), 
				React.createElement("table", {className: "table table-condensed table-hover voting-table"}, 
					maps
				)
			)
		);
	}
})

var Gather = React.createClass({displayName: "Gather",
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
			return (React.createElement("h1", null, "Gather Completed! Now restart the app"));
		}

		var voting;
		if (this.props.currentGatherer) {
			voting = (
				React.createElement("div", {className: "panel-body"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-6"}, 
							React.createElement(MapVoting, React.__spread({},  this.props))
						), 
						React.createElement("div", {className: "col-md-6"}, 
							React.createElement(ServerVoting, React.__spread({},  this.props))
						)
					)
				)
			);
		}

		var gatherTeams;
		if (this.props.gather.state === 'selection') {
			gatherTeams = React.createElement(GatherTeams, {gather: this.props.gather})
		}
		return (
			React.createElement("div", {className: "panel panel-default"}, 
				React.createElement("div", {className: "panel-heading"}, 
					React.createElement("strong", null, "NS2 Gather "), 
					React.createElement("span", {className: "badge add-left"}, this.props.gather.gatherers.length)
				), 
				React.createElement(GatherProgress, {gather: this.props.gather}), 
				React.createElement(Gatherers, {gather: this.props.gather, currentGatherer: this.props.currentGatherer}), 
				voting, 
				gatherTeams, 
				React.createElement(GatherActions, React.__spread({},  this.props))
			)
		);
	}
});

var Gatherers = React.createClass({displayName: "Gatherers",
	render: function () {
		var self = this;
		var gatherers = this.props.gather.gatherers.map(function (gatherer) {
			// Switch this to online status
			var online= (React.createElement("div", {className: "dot online"}));

			var division = (React.createElement("span", {className: "label label-primary"}, gatherer.user.ability.division));
			var action;

			if (self.props.gather.state === 'gathering') {
				action = (
					gatherer.user.ability.lifeforms.map(function (lifeform) {
						return (React.createElement("span", {className: "label label-default"}, lifeform));
					})
				);
			}

			if (self.props.gather.state === "election") {
				var votes = self.props.gather.gatherers.reduce(function (acc, voter) {
					if (voter.leaderVote === gatherer.id) acc++;
					return acc;
				}, 0)
				action = (
					React.createElement("span", null, 
						React.createElement("small", null, votes + " votes", "  "), 
						React.createElement(VoteButton, {currentGatherer: self.props.currentGatherer, candidate: gatherer})
					)
				);
			}

			if (self.props.gather.state === 'selection') {
				action = (
					React.createElement("span", null, 
						React.createElement(SelectPlayerButton, {gatherer: gatherer})
					)
				);
			}

			return (
				React.createElement("tr", {key: gatherer.user.id}, 
					React.createElement("td", {className: "col-md-6"}, online, " ", gatherer.user.username), 
					React.createElement("td", {className: "col-md-3"}, division, " "), 
					React.createElement("td", {className: "col-md-3 text-right"}, action, " ")
				)
			);
		})
		if (this.props.gather.gatherers.length) {
			return (
				React.createElement("div", {className: "panel-body"}, 
					React.createElement("div", {className: "panel panel-default"}, 
						React.createElement("table", {className: "table roster-table"}, 
							React.createElement("tbody", null, 
								gatherers
							)
						)
					)
				)
			);
		} else {
			return (
				React.createElement("div", {className: "panel-body text-center join-hero"}, 
					React.createElement(JoinGatherButton, {buttonClass: "btn-lg", buttonName: "Start a Gather"})
				)
			);
		}
	}
});




"use strict";

var socket;

function initialiseVisibilityMonitoring (socket) {
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
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
}

function initialiseComponents () {
	var socketUrl = window.location.protocol + "//" + window.location.host;
	socket = io(socketUrl)
		.on("connect", function () {
			console.log("Connected");
		})
		.on("reconnect", function () {
			console.log("Reconnected");
		})
		.on("disconnect", function () {
			console.log("Disconnected")
		});

	initialiseVisibilityMonitoring(socket);

	// Render Page
	React.render(React.createElement(UserMenu, null), document.getElementById('side-menu'));
	React.render(React.createElement(Chatroom, null), document.getElementById('chatroom'));
	React.render(React.createElement(Gather, null), document.getElementById('gathers'));
	React.render(React.createElement(CurrentUser, null), document.getElementById('currentuser'));
};

"use strict";

var Chatroom = React.createClass({displayName: "Chatroom",
	getDefaultProps: function () {
		return {
			history: []
		};
	},
	componentDidMount: function () {
		var self = this;
		var TIMER_INTERVAL = 60000; // Every minute

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

		self.timer = setInterval(function () {
			if (self.refs.messages) self.refs.messages.refreshTime();
		}, TIMER_INTERVAL);
	},

	componentDidUnmount: function () {
		clearInterval(this.timer);
	},
	sendMessage: function (message) {
		socket.emit("newMessage", {message: message});
	},
	scrollToBottom: function () {
		var node = React.findDOMNode(this.refs.messageContainer);
	  node.scrollTop = node.scrollHeight;
	},
	render: function () {
		var messages = this.props.history.map(function (message) {
			return (
				React.createElement(ChatMessage, {
					avatar: message.author.avatar, 
					username: message.author.username, 
					content: message.content, 
					ref: "messages", 
					createdAt: message.createdAt})
			);
		});
		return (
			React.createElement("div", {className: "panel panel-default"}, 
				React.createElement("div", {className: "panel-heading"}, "Gather Chat"), 
				React.createElement("div", {className: "panel-body"}, 
					React.createElement("ul", {className: "chat", id: "chatmessages", ref: "messageContainer"}, 
						messages
					)
				), 
				React.createElement("div", {className: "panel-footer"}, 
					React.createElement(MessageBar, null)
				)
			)
		);
	}
});

var ChatMessage = React.createClass({displayName: "ChatMessage",
	getInitialState: function () {
		return {
			timeAgo: $.timeago(this.props.createdAt)
		}
	},
	refreshTime: function () {
		var self = this;
		self.setState({
			timeAgo: $.timeago(self.props.createdAt)
		});
	},
	render: function () {
		return (
			React.createElement("li", {className: "left clearfix"}, 
				React.createElement("span", {className: "chat-img pull-left"}, 
						React.createElement("img", {
							src: this.props.avatar, 
							alt: "User Avatar", 
							height: "40", 
							width: "40", 
							className: "img-circle"})
				), 
				React.createElement("div", {className: "chat-body clearfix"}, 
					React.createElement("div", {className: "header"}, 
						React.createElement("strong", {className: "primary-font"}, this.props.username), 
						React.createElement("small", {className: "pull-right text-muted"}, 
							React.createElement("i", {className: "fa fa-clock-o fa-fw"}), " ", this.state.timeAgo
						)
					), 
					React.createElement("p", null, this.props.content)
				)
			)
		);
	}
});

var MessageBar = React.createClass({displayName: "MessageBar",
	sendMessage: function (content) {
		socket.emit("message:new", {
			content: content
		});
	},
	handleSubmit: function (e) {
		e.preventDefault();
		var content = React.findDOMNode(this.refs.content).value.trim();
		if (!content) return;
		React.findDOMNode(this.refs.content).value = '';
		this.sendMessage(content);
		return;
	},
	render: function () {
		return (
			React.createElement("form", {onSubmit: this.handleSubmit}, 
				React.createElement("div", {className: "input-group"}, 
					React.createElement("input", {
						id: "btn-input", 
						type: "text", 
						className: "form-control", 
						ref: "content", 
						placeholder: "Be polite please..."}), 
					React.createElement("span", {className: "input-group-btn"}, 
						React.createElement("input", {
							type: "submit", 
							className: "btn btn-primary", 
							id: "btn-chat", 
							value: "Send"})
					)
				)
			)
		);
	}
});

"use strict";

var UserCounter = React.createClass({displayName: "UserCounter",
	render: function () {
		return (
			React.createElement("li", null, 
				React.createElement("a", {href: "#"}, 
					React.createElement("i", {className: "fa fa-users fa-fw"}), " Online",  
					React.createElement("span", {className: "badge add-left"}, " ", this.props.count, " ")
				)
			)
		);
	}
});

var UserLogin = React.createClass({displayName: "UserLogin",
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
			React.createElement("form", {onSubmit: this.handleSubmit}, 
				React.createElement("div", {className: "input-group signin"}, 
					React.createElement("input", {
						id: "btn-input", 
						type: "text", 
						className: "form-control", 
						ref: "authorize_id", 
						placeholder: "Choose an ID..."}), 
					React.createElement("span", {className: "input-group-btn"}, 
						React.createElement("input", {
							type: "submit", 
							className: "btn btn-primary", 
							id: "btn-chat", 
							value: "Login"})
					)
				), 
				React.createElement("div", {className: "signin"}, 
				React.createElement("p", {className: "text-center"}, React.createElement("small", null, "Just a temporary measure until genuine authentication is implemented"))
				)
			)
		);
	}
})

var UserMenu = React.createClass({displayName: "UserMenu",
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
				React.createElement("li", {key: user.id}, React.createElement("a", {href: "#"}, user.username))
			);
		});
		return (
			React.createElement("ul", {className: "nav", id: "side-menu"}, 
				React.createElement(UserCounter, React.__spread({},  this.props)), 
				users, 
				React.createElement("li", null, React.createElement("br", null), React.createElement(UserLogin, null), React.createElement("br", null))
			)
		);
	}
});

var CurrentUser = React.createClass({displayName: "CurrentUser",
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
				React.createElement("a", {href: "#"}, this.props.user.username, "  ", React.createElement("img", {src: this.props.user.avatar, 
					alt: "User Avatar", 
					height: "20", 
					width: "20"}))
			);
		} else {
			return false;
		}
	}
});
