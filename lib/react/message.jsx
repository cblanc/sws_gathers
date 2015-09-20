"use strict";

var Chatroom = React.createClass({
	getDefaultProps() {
		return {
			history: []
		};
	},

	componentDidMount() {
		let self = this;

		socket.on("message:append", data => {
			let history = self.props.history;
			history.push(data);
			self.setProps({
				history: history.sort((a, b) => {
					return new Date(a.createdAt) - new Date(b.createdAt);
				})
			});
			self.scrollToBottom();
		});

		// Message History Retrieved
		socket.on("message:refresh", data => {
			self.setProps({
				history: data.chatHistory
			});
			self.scrollToBottom();
		});

		socket.on("users:update", data => {
			self.setProps({
				currentUser: data.currentUser
			});
		});

		socket.emit("message:refresh", {});
	},

	loadMoreMessages() {
		socket.emit("message:refresh", {
			// before: 
		});
	},

	sendMessage(message) {
		socket.emit("newMessage", {message: message});
	},

	scrollToBottom() {
		let node = React.findDOMNode(this.refs.messageContainer);
	  node.scrollTop = node.scrollHeight;
	},

	render() {
		let messages = this.props.history.map(message => 
			<ChatMessage message={message} 
				key={message.id} 
				currentUser={this.props.currentUser} />
		);
		return (
			<div className="panel panel-default chatbox">
				<div className="panel-heading">Gather Chat</div>
				<div className="panel-body">
					<ul className="chat" id="chatmessages" ref="messageContainer">
						<li className="text-center">
							<a href="#"
								className="btn btn-primary btn-xs">
								Load more messages
							</a>
						</li>
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
	mixins: [
    ReactAutolink
  ],

  getInitialState() {
  	return {
  		createdAt: ""
  	}
  },

  updateCreatedAt() {
  	let self = this;
  	if (this.props.message.createdAt) {
  		self.setState({
  			createdAt: $.timeago(self.props.message.createdAt)
  		})
  	}
  },

	componentDidMount() {
		this.updateCreatedAt();
		this.interval = setInterval(this.updateCreatedAt, 60000);
	},

	componentWillUnmount: function () {
		clearInterval(this.interval);
	},

	messageContent: function () {
		return this.autolink(this.props.message.content, { 
			target: "_blank", 
			rel: "nofollow" 
		});
	},

	render() {
		let deleteButton;
		let currentUser = this.props.currentUser;
		if (currentUser && currentUser.admin) {
			deleteButton = <DeleteMessageButton messageId={this.props.message._id} />;
		}
		return (
			<li className="left clearfix">
				<span className="chat-img pull-left">
						<img 
							src={this.props.message.author.avatar} 
							alt="User Avatar" 
							height="40"
							width="40"
							className="img-circle" />
				</span>
				<div className="chat-body clearfix">
					<div className="header">
						<strong className="primary-font">
							{this.props.message.author.username}
							</strong>
						<small className="pull-right text-muted">
							{deleteButton}
							<i className="fa fa-clock-o fa-fw"></i> 
							{this.state.createdAt}
						</small>
					</div>
					<p className="wordwrap">{this.messageContent()}</p>
				</div>
			</li>
		);
	}
});

var DeleteMessageButton = React.createClass({
	handleClick (e) {
		e.preventDefault();
		socket.emit("message:delete", {
			id: this.props.messageId
		});
	},

	render() {
		return (
			<a href="#" onClick={this.handleClick}>
				<i className="fa fa-trash-o"></i>
			</a>
		);
	}
})

var MessageBar = React.createClass({
	sendMessage(content) {
		socket.emit("message:new", {
			content: content
		});
	},

	handleSubmit(e) {
		e.preventDefault();
		let content = React.findDOMNode(this.refs.content).value.trim();
		if (!content) return;
		React.findDOMNode(this.refs.content).value = '';
		this.sendMessage(content);
		return;
	},

	render() {
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

