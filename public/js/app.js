$(function () {

"use strict";

var GatherCounter = React.createClass({displayName: "GatherCounter",
	render: function () {
		return (
			React.createElement("li", null, 
				React.createElement("a", {href: "#"}, 
					React.createElement("i", {className: "fa fa-users fa-fw"}), " Gatherers",  
					React.createElement("span", {className: "badge add-left"}, " ", this.props.count, " ")
				)
			)
		);
	}
});

var UserLogin = React.createClass({displayName: "UserLogin",
	handleSubmit: function () {

	},
	render: function () {
		return (
			React.createElement("form", {onSubmit: this.handleSubmit}, 
				React.createElement("div", {className: "input-group"}, 
					React.createElement("input", {
						id: "btn-input", 
						type: "text", 
						className: "form-control", 
						placeholder: "Choose an ID..."}), 
					React.createElement("span", {className: "input-group-btn"}, 
						React.createElement("input", {
							type: "submit", 
							className: "btn btn-primary", 
							id: "btn-chat", 
							value: "Login"})
					)
				)
			)
		);
	}
})

var Gatherer = React.createClass({displayName: "Gatherer",
	render: function () {
		return (
			React.createElement("li", null, 
				React.createElement("a", {href: "#"}, this.props.gatherer.username)
			)
		);
	}
});

var GathererMenu = React.createClass({displayName: "GathererMenu",
	componentDidMount: function () {
		socket.on('gatherCount', this.updateGatherers);
	},
	updateGatherers: function (data) {
		this.setProps({
			count: data.count,
			gatherers: data.gatherers
		});
	},
	render: function () {
		var gatherers = this.props.gatherers.map(function (gatherer) {
			return (
				React.createElement(Gatherer, {gatherer: gatherer})
			);
		});
		return (
			React.createElement("ul", {className: "nav", id: "side-menu"}, 
				React.createElement("li", null, 
					React.createElement(UserLogin, null)
				), 
				React.createElement(GatherCounter, React.__spread({},  this.props)), 
				gatherers
			)
		);
	}
});

var Chatroom = React.createClass({displayName: "Chatroom",
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
		console.log(node)
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

var socket;

function initialiseComponents () {
	socket = io("http://localhost:8000/")
		.on("connect", function () {
			console.log("Connected");
		})
		.on("reconnect", function () {
			console.log("Reconnected");
		})
		.on("disconnect", function () {
			console.log("Disconnected")
		});

	React.render(React.createElement(GathererMenu, {count: 0, gatherers: []}), document.getElementById('side-menu'));
	React.render(React.createElement(Chatroom, {history: []}), document.getElementById('chatroom'));
};

initialiseComponents();



});

