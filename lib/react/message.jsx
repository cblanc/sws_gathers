"use strict";

var Chatroom = React.createClass({
	getDefaultProps() {
		return {
			history: []
		};
	},

	componentDidMount() {
		let self = this;

		socket.on("message:new", data => {
			let history = self.props.history;
			history.push(data);
			self.setProps({
				history: history
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

		socket.emit("message:refresh", {});
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
			<ChatMessage message={message} key={message.id} />
		);
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

let updateMessageCallbacks = [];

let timer = setInterval(() => {
	updateMessageCallbacks.forEach(callback => callback())
}, 60000);

var ChatMessage = React.createClass({
	componentDidMount() {
		let self = this;
		updateMessageCallbacks.push(() => {
			self.forceUpdate();
		});
	},

	render() {
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
						<strong className="primary-font">{this.props.message.author.username}</strong>
						<small className="pull-right text-muted">
							<i className="fa fa-clock-o fa-fw"></i> {$.timeago(this.props.message.createdAt)}
						</small>
					</div>
					<p>{this.props.message.content}</p>
				</div>
			</li>
		);
	}
});

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

