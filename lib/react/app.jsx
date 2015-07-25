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

var UserLine = React.createClass({
	render: function () {
		return (
			<li>
				<a href="#">{this.props.user.username}</a>
			</li>
		);
	}
});

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
				<UserLine user={user} />
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
			self.refs.messages.refreshTime();
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
	joinGather: function (e) {
		e.preventDefault();
		socket.emit("gather:join", {});
	},
	leaveGather: function (e) {
		e.preventDefault();
		socket.emit("gather:leave", {});
	},
	render: function () {
		var joinButton;
		if (this.joinedGather()) {
			joinButton = (<button 
							onClick={this.leaveGather} 
							className="btn btn-danger">Leave Gather</button>);
		} else {
			joinButton = (<button 
							onClick={this.joinGather} 
							className="btn btn-primary">Join Gather</button>);
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Current Gather 
					<span className="badge add-left"> {this.props.gather.gatherers.length} </span>
				</div>
				<Gatherers gatherers={this.props.gather.gatherers} />
				<div className="panel-body">
				</div>
				<div className="panel-footer text-right">
					{joinButton}
				</div>
			</div>
		);
	}
});

// var GatherState = React.createClass({
// 	getDefaultProps: function () {
// 		return {
// 			"state": "none"
// 		}
// 	},
// 	stateDescription: function () {
// 		switch(this.props.date) {
// 			case "gathering":
// 				return "Waiting on more players to join"
// 		}
// 	},
// 	render: function () {
// 		<div className="well">
// 			<p>{this.displayState}</p>
// 		</div>
// 	}
// })

var Gatherers = React.createClass({
	render: function () {
		var gatherers = this.props.gatherers.map(function (gatherer) {
			var lifeforms = (
				gatherer.user.ability.lifeforms.map(function (lifeform) {
					return <span className="label label-default">{lifeform}</span>;
				})
			);
			var division = (<span className="label label-primary">{gatherer.user.ability.division}</span>)

			return (
				<tr>
					<td>{gatherer.user.username}</td>
					<td>{division}</td>
					<td>{lifeforms}</td>
				</tr>
			);
		})
		return (
			<table className="table table-striped gatherer-table">
				<thead>
					<tr>
						<th>Player</th>
						<th>Ability</th>
						<th>Life Forms</th>
					</tr>
				</thead>
				<tbody>
					{gatherers}
				</tbody>
			</table>
		);
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
};

initialiseComponents();



});

