"use strict";

var App = React.createClass({
	getDefaultProps() {
		return {
			gather: {
				gatherers: []
			},
			users: [],
			messages: [],
			maps: [],
			servers: [],
			archive: [],
			soundController: null
		}
	},

	componentDidMount() {
		let self = this;
		let socket = this.props.socket;

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
		return <div id="wrapper">
			<nav className="navbar navbar-default navbar-static-top" 
				role="navigation" 
				style={{marginBottom: "0"}}>
				<div className="navbar-header">
					<a className="navbar-brand" href="/">ENSL.org Gathers <strong>Alpha</strong></a>
				</div>
			  <ul className="nav navbar-top-links navbar-right" id="currentuser">
			  	<CurrentUser user={this.props.user} />
			  </ul>
			  <ul className="nav navbar-top-links navbar-right" id="soundcontroller">
			  	<SoundPanel soundController={this.props.soundController} />
			  </ul>
			  <ul className="nav navbar-top-links navbar-right">
				  <li className="dropdown">
						<a className="dropdown-toggle" data-toggle="dropdown" href="#">
							Info &nbsp;<i className="fa fa-caret-down"></i>
						</a>
						<ul className="dropdown-menu">
							<li>
								<a href="https://github.com/cblanc/sws_gathers" target="_blank">
									Github&nbsp;<i className="fa fa-github">&nbsp;</i>
								</a>
							</li>
							<li>
								<a href="http://steamcommunity.com/id/nslgathers" target="_blank">
									Steam Bot&nbsp;<i className="fa fa-external-link">&nbsp;</i>
								</a>
							</li>
							<li>
								<a href="http://www.ensl.org/articles/464" target="_blank">
									Gather Rules&nbsp;<i className="fa fa-external-link">&nbsp;</i>
								</a>
							</li>
						</ul>
					</li>
			  </ul>
			</nav>
			<AdminPanel />
			<ProfileModal user={this.props.user} />
			<div style={{minHeight: "750px"}}>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-2 hidden-xs">
							<ul className="nav" id="side-menu">
								<UserMenu users={this.props.users} />
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
								user={this.props.user} 
								maps={this.props.maps}
								servers={this.props.servers}
								previousGather={this.props.previousGather}/>
						</div>	
						<div className="col-md-6 col-md-offset-6" id="archived-gathers">
							<ArchivedGathers archive={this.props.archive}
								maps={this.props.maps}
								servers={this.props.servers} />
						</div>
					</div>
				</div>
			</div>
		</div>
	}
});