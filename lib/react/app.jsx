$(function () {

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
		socket.on('userCount', this.updateUsers);
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

var Chatroom = React.createClass({
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
				<ChatMessage 
					avatar={message.author.avatar} 
					username={message.author.username}
					content={message.content}
					ref="messages"
					createdAt={message.createdAt} />
			);
		});
		return (
			<div className="panel panel-default">
				<div className="panel-heading">Gather Chat</div>
				<div className="panel-body">
					<ul className="chat" id="chatmessages" ref="messageContainer">
						{messages}
					</ul>
				</div>
				<div className="panel-footer">
					<MessageBar />
				</div>
			</div>
		);
	}
});

var ChatMessage = React.createClass({
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
			<li className="left clearfix">
				<span className="chat-img pull-left">
						<img 
							src={this.props.avatar} 
							alt="User Avatar" 
							height="40"
							width="40"
							className="img-circle" />
				</span>
				<div className="chat-body clearfix">
					<div className="header">
						<strong className="primary-font">{this.props.username}</strong>
						<small className="pull-right text-muted">
							<i className="fa fa-clock-o fa-fw"></i> {this.state.timeAgo}
						</small>
					</div>
					<p>{this.props.content}</p>
				</div>
			</li>
		);
	}
});

var CurrentUser = React.createClass({
	getDefaultProps: function () {
		return {
			username: "",
			avatar: ""
		}
	},
	componentDidMount: function () {
		
	},
	render: function () {
		return (
			<a href="#">{this.props.user.username} &nbsp;<img src={this.props.user.avatar}
				alt="User Avatar" 
				height="20"
				width="20" /></a>
		);
	}
});

var MessageBar = React.createClass({
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
			<form onSubmit={this.handleSubmit} >
				<div className="input-group">
					<input 
						id="btn-input" 
						type="text" 
						className="form-control" 
						ref="content"
						placeholder="Be polite please..." />
					<span className="input-group-btn">
						<input 
							type="submit" 
							className="btn btn-primary" 
							id="btn-chat" 
							value="Send" />
					</span>
				</div>
			</form>
		);
	}
});

var JoinGatherButton = React.createClass({
	joinGather: function (e) {
		e.preventDefault();
		socket.emit("gather:join", {});
	},
	render: function () {
		var message = this.props.buttonName || "Join Gather";
		var buttonClass = "btn btn-primary";
		if (this.props.buttonClass) {
			buttonClass += " " + this.props.buttonClass;
		}
		return (<button 
							onClick={this.joinGather} 
							className={buttonClass}>{message}</button>)
	}
});

var GatherProgress = React.createClass({
	gatheringProgress: function () {
		var num = this.props.gather.gatherers.length;
		var den = 12;
		return {
			num: num,
			den: den,
			message: num + " / " + den
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
				<div className="panel-body">
					<p>Gather Progress</p>
					<div className="progress">
					  <div className="progress-bar progress-bar-striped active" 
					  	data-role="progressbar" 
					  	data-aria-valuenow={progress.num} 
					  	data-aria-valuemin="0" 
					  	data-aria-valuemax={progress.den} 
					  	style={style}>
					    {progress.message}
					  </div>
				  </div>
				</div>
			);
		} else {
			return false;
		}
	}
});

var Gather = React.createClass({
	getDefaultProps: function () {
		return {
			gather: {
				gatherers: []
			}
		}
	},
	joinedGather: function () {
		var self = this;
		return this.props.gather.gatherers.some(function (gatherer) {
			return gatherer.user.id === self.props.user.id;
		});
	},
	componentDidMount: function () {
		var self = this;
		socket.on("gather:refresh", function (data) {
			self.setProps({
				gather: data.gather,
				user: data.user
			});
		});
	},
	stateDescription: function () {
		switch(this.props.gather.state) {
			case "gathering":
				return "Waiting for more gatherers";
			case "election":
				return "Currently voting for team leaders";
			case "selection":
				return "Waiting for leaders to picking teams";
			case "done":
				return "Gather completed";
			default:
				return "Initialising gather";
		}
	},
	leaveGather: function (e) {
		e.preventDefault();
		socket.emit("gather:leave", {});
	},
	inviteToGather: function (e) {
		e.preventDefault();
	},
	render: function () {
		var joinButton;
		if (this.joinedGather()) {
			joinButton = (<li><button 
							onClick={this.leaveGather} 
							className="btn btn-danger">Leave Gather</button></li>);
		} else {
			joinButton = (<li><JoinGatherButton /></li>);
		}
		var inviteButton;
		if (this.props.gather.state === 'gathering') {
			inviteButton = (<li><button
							onClick={this.inviteToGather}
							className="btn btn-primary">Invite to Gather</button></li>);
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<strong>NS2 Gather </strong>
					<span className="badge add-left">{this.props.gather.gatherers.length}</span>
					<br />
					{this.stateDescription()}
				</div>
				<Gatherers gatherers={this.props.gather.gatherers} />
				<GatherProgress gather={this.props.gather} />
				<div className="panel-footer text-right">
					<ul className="list-inline">
						{inviteButton}
						{joinButton}
					</ul>
				</div>
			</div>
		);
	}
});

var LeaderPoll = React.createClass({
	render: function () {
		return (
			<div className="panel-body">
			</div>
		);
	}
});

var Gatherers = React.createClass({
	render: function () {
		var gatherers = this.props.gatherers.map(function (gatherer) {
			var lifeforms = (
				gatherer.user.ability.lifeforms.map(function (lifeform) {
					return (<span className="label label-default">{lifeform}</span>);
				})
			);
			var division = (<span className="label label-primary">{gatherer.user.ability.division}</span>);
			var commBadge;
			if (gatherer.user.ability.commander) {
				commBadge = (<img src="/images/commander.png" 
							alt="Commander" 
							height="20"
							width="20" />);
			}

			return (
				<tr key={gatherer.user.id}>
					<td className="col-md-1">{commBadge}</td>
					<td className="col-md-5">{gatherer.user.username}</td>
					<td className="col-md-3">{division}&nbsp;</td>
					<td className="col-md-3">{lifeforms}&nbsp;</td>
				</tr>
			);
		})
		if (this.props.gatherers.length) {
			return (
				<div className="panel-body">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h5 className="panel-title">Roster</h5>
						</div>
						<table className="table roster-table">
							<tbody>
								{gatherers}
							</tbody>
						</table>
					</div>
				</div>
			);
		} else {
			return (<div className="panel-body text-center"><JoinGatherButton buttonClass="btn-lg" buttonName="Start a Gather" /></div>);
		}
	}
});

var socket;

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

	React.render(<UserMenu />, document.getElementById('side-menu'));
	React.render(<Chatroom />, document.getElementById('chatroom'));
	React.render(<Gather />, document.getElementById('gathers'));
	React.render(<CurrentUser />, document.getElementById('currentuser'));
};

initialiseComponents();



});

