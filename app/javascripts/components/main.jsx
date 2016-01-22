const React = require("react");
const Gather = require("javascripts/components/gather").Gather;
const ArchivedGather = require("javascripts/components/gather").ArchivedGather;
const Event = require("javascripts/components/event");
const Message = require("javascripts/components/message");
const Settings = require("javascripts/components/settings");
const Sound = require("javascripts/components/sound");
const User = require("javascripts/components/user");


const SplashScreen = React.createClass({
	getInitialState() {
		return {
			status: "connecting", // connected, authFailed, banned
			socket: null
		}
	},

	componentDidMount() {
		const socketUrl = window.location.protocol + "//" + window.location.host;
		let socket = io(socketUrl)
			.on("connect", () => {
				console.log("Connected");
				// removeAuthWidget();
				socket.on("reconnect", () => {
						console.log("Reconnected");
						this.setState({ status: "connected" });
					})
					.on("disconnect", () => {
						console.log("Disconnected")
					});
			})
			.on("error", error => {
				console.log(error);
				if (error === "Authentication Failed") {
					this.setState({ status: "authFailed" });
				} else if (error === "Gather Banned") {
					this.setState({ status: "banned" });
				}
			});

		this.setState({ socket: socket });
	},

	render() {
		const status = this.state.status;
		if (status === "connected") {
			return <App socket={this.state.socket} />;
		} 

		let splash;
		if (status === "authFailed") {
			splash = <AuthFailedSplash />
		} else if (status === "banned") {
			splash = <BannedSplash />
		} else {
			splash = <ConnectingSplash />
		}

		return (
			<div>
				<div style="min-height: 750px;">
					<div class="container-fluid">
						{splash}
					</div>
				</div>
			</div>
		);
	}
});

const AuthFailedSplash = React.createClass({
	render() {
		return (
			<div class="row" id="auth-required">
				<div class="col-lg-6 col-lg-offset-3">
					<div class="add-top jumbotron jumbo-auth text-center">
						<div>
							<img src="/ensl_logo.png" alt="ENSL Logo" />
						</div>
						<h3>You need to be logged in to the ENSL website to access gathers</h3>
						<h3><small>If you are logged on, try visiting a few pages on ENSL.org so the server can update your cookies</small></h3>
						<h3><small>If this error persists please contact an admin to fix it</small></h3>
						<br />
					  <p><a class="btn btn-primary btn-lg" href="www.ensl.org" role="button">Go to website</a></p>
					</div>
				</div>
			</div>
		);
	}
});

const BannedSplash = React.createClass({
	render() {
		return (
			<div className="row">
				<div className="col-lg-6 col-lg-offset-3">
					<div className="add-top jumbotron jumbo-auth text-center">
						<div>
							<img src="/ensl_logo.png" alt="ENSL Logo" />
						</div>
						<h3>You're currently barred from joining gathers</h3>
						<h3><small>Either wait for the ban to expire or talk to an admin to get it lifted</small></h3>
						<br />
					  <p><a className="btn btn-primary btn-lg" href="http://www.ensl.org/bans" role="button">See the ban list</a></p>
					</div>
				</div>
			</div>
		);
	}
});

const ConnectingSplash = React.createClass({
	render() {
		return (
			<div className="row" id="authenticating">
				<div className="col-lg-6 col-lg-offset-3">
					<div className="add-top jumbotron jumbo-auth text-center">
						<div>
							<img src="/ensl_logo.png" className="jumbo-img" alt="ENSL Logo" />
						</div>
						<br />
						<h3>Authenticating your ENSL account</h3>
						<br />
						<div>
							<img src="/spinner.svg" className="spinner" alt="Loading" />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

const App = React.createClass({
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
			events: [],
			updateTitle: updateTitle,
			showEventsPanel: showEventsPanel,
			soundController: new SoundController()
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
		let soundController = this.state.soundController;

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
		socket.emit("gather:refresh");
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
			  	<SoundPanel soundController={this.state.soundController} />
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
								soundController={this.state.soundController}
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

module.exports = SplashScreen;