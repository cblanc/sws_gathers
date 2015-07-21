var GatherCounter = React.createClass({
	render: function () {
		return (
			<li>
				<a href="#">
					<i className="fa fa-users fa-fw"></i> Gatherers 
					<span className="badge add-left"> {this.props.count} </span>
				</a>
			</li>
		);
	}
});

var Gatherer = React.createClass({
	render: function () {
		return (
			<li>
				<a href="#">{this.props.gatherer.username}</a>
			</li>
		);
	}
});

var GathererMenu = React.createClass({
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
				<Gatherer gatherer={gatherer} />
			);
		});
		return (
			<ul className="nav" id="side-menu">
				<GatherCounter {...this.props} />
				{gatherers}
			</ul>
		);
	}
});

var Chatroom = React.createClass({
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


React.render(<GathererMenu count={0} gatherers={[]} />, document.getElementById('side-menu'));
React.render(<Chatroom history={[]}/>, document.getElementById('chatroom'));
