"use strict";

var App = React.createClass({
	getInitialState() {
		let updateTitle = true;
		let showEventsPanel = true;

		if (storageAvailable('localStorage')) {
			if (localStorage.getItem("updateTitle") !== null) {
				updateTitle = JSON.parse(localStorage.getItem("updateTitle"));
			}
			if (localStorage.getItem("showEventsPanel") !== null) {
				showEventsPanel = JSON.parse(localStorage.getItem("showEventsPanel"));
			}
		}

		return {
			updateTitle: updateTitle,
			showEventsPanel: showEventsPanel,
			events: []
		};
	},

	getDefaultProps() {
		return {
			gather: {
				gatherers: []
			},
			users: [],
			messages: [],
			maps: [],
			user: null,
			servers: [],
			archive: [],
			socket: null,
			soundController: null
		};
	},

	updateTitle() {
		let gather = this.props.gather;
		if (gather && this.state.updateTitle) {
			document.title = `NSL Gathers (${gather.gatherers.length}/12)`;
			return;
		}
		document.title = "NSL Gathers";
	},

	toggleEventsPanel(event) {
		let newState = event.target.checked;
		this.setState({ showEventsPanel: newState });
		if (storageAvailable('localStorage')) {
			localStorage.setItem("showEventsPanel", newState)
		}
	},

	toggleUpdateTitle(event) {
		let newState = event.target.checked;
		this.setState({ updateTitle: newState });
		if (storageAvailable('localStorage')) {
			localStorage.setItem("updateTitle", newState)
		}
		this.updateTitle();
	},

	thisGatherer() {
		let gather = this.props.gather;
		let user = this.props.user;
		if (gather && user && gather.gatherers.length) {
			return gather.gatherers
				.filter(gatherer => gatherer.id === user.id)
				.pop() || null;
		}
		return null;
	},

	componentDidMount() {
		let self = this;
		let socket = this.props.socket;
		let soundController = this.props.soundController;

		this.updateTitle();

		socket.on('stateChange', data => {
			let state = data.state;
			
			if (state.from === 'gathering'
					&& state.to === 'election'
					&& this.thisGatherer()) {
				soundController.playGatherMusic();
			}

			if (state.from === 'election'
					&& state.to === 'gathering') {
				soundController.stop();
			}
		});

		socket.on('event:append', data => {
			let events = self.state.events;
			events.unshift(data);
			self.setState({
				events: events.slice(0, 20)
			});
		});

		socket.on('users:update', 
			data => self.setProps({
				users: data.users,
				user: data.currentUser
			})
		);

		socket.on("message:append", data => {
			self.setProps({
				messages: self.props.messages.concat(data.messages)
					.sort((a, b) => {
						return new Date(a.createdAt) - new Date(b.createdAt);
					})
			});
		});

		socket.on("message:refresh", data => {
			self.setProps({
				messages: data.messages
			});
		});

		socket.on("gather:refresh", (data) => {
			self.setProps({
				gather: data.gather,
				maps: data.maps,
				servers: data.servers,
				previousGather: data.previousGather
			});
			this.updateTitle();
		});

		socket.on("gather:archive:refresh", data => {
			self.setProps({
				archive: data.archive,
				maps: data.maps,
				servers: data.servers
			});
		});

		socket.emit("users:refresh");
		socket.emit("message:refresh");
	},

	render() {
		let eventsPanel;
		if (this.state.showEventsPanel) {
			eventsPanel = <Events events={this.state.events} />;
		}

		return <div id="wrapper">
			<nav className="navbar navbar-default navbar-static-top" 
				role="navigation" 
				style={{marginBottom: "0"}}>
				<div className="navbar-header">
					<a className="navbar-brand" href="/">NSL Gathers <small><i>Alpha</i></small></a>
				</div>
			  <ul className="nav navbar-top-links navbar-right" id="currentuser">
			  	<CurrentUser user={this.props.user} />
			  </ul>
			  <ul className="nav navbar-top-links navbar-right" id="soundcontroller">
			  	<SoundPanel soundController={this.props.soundController} />
			  </ul>
			  <TeamSpeakButton />
			  <ul className="nav navbar-top-links navbar-right">
				  <li className="dropdown">
						<a className="dropdown-toggle" data-toggle="dropdown" href="#">
							Info &nbsp;<i className="fa fa-caret-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li>
								<a href="https://github.com/cblanc/sws_gathers" target="_blank">
									<i className="fa fa-github">&nbsp;</i>&nbsp;Github
								</a>
							</li>
							<li>
								<a href="http://steamcommunity.com/id/nslgathers" target="_blank">
									<i className="fa fa-external-link">&nbsp;</i>&nbsp;Steam Bot
								</a>
							</li>
							<li>
								<a href="http://www.ensl.org/articles/464" target="_blank">
									<i className="fa fa-external-link">&nbsp;</i>&nbsp;Gather Rules
								</a>
							</li>
							<li>
								<a href="/messages" target="_blank">
									<i className="fa fa-external-link">&nbsp;</i>&nbsp;Message Archive
								</a>
							</li>
						</ul>
					</li>
			  </ul>
			</nav>
			<AdminPanel />
			<SettingsPanel 
				toggleEventsPanel={this.toggleEventsPanel}
				showEventsPanel={this.state.showEventsPanel}
				toggleUpdateTitle={this.toggleUpdateTitle}
				updateTitle={this.state.updateTitle} />
			<TeamSpeakModal />
			<ProfileModal user={this.props.user} />
			<div style={{minHeight: "750px"}}>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-2 hidden-xs">
							<ul className="nav" id="side-menu">
								<UserMenu users={this.props.users} user={this.props.user} />
							</ul>
						</div>
						<div className="col-md-4" id="chatroom">
							<Chatroom 
								messages={this.props.messages} 
								user={this.props.user} />
						</div>
						<div className="col-md-6" id="gathers">
							<Gather 
								gather={this.props.gather}
								thisGatherer={this.thisGatherer()}
								user={this.props.user} 
								soundController={this.props.soundController}
								maps={this.props.maps}
								servers={this.props.servers}
								previousGather={this.props.previousGather}/>
							<hr />
							<ArchivedGathers archive={this.props.archive}
								maps={this.props.maps}
								servers={this.props.servers} />
							<hr />
							{eventsPanel}
						</div>
					</div>
				</div>
			</div>
		</div>
	}
});