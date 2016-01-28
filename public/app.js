(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("javascripts/app", function(exports, require, module) {
"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var App = require("javascripts/components/main");

module.exports = function (mount) {
	ReactDOM.render(React.createElement(App, null), mount);
};
});

require.register("javascripts/components/event", function(exports, require, module) {
"use strict";

var React = require("react");
var Events = exports.Events = React.createClass({
	displayName: "Events",

	propTypes: {
		events: React.PropTypes.array.isRequired
	},

	getTime: function getTime(timeString) {
		return new Date(timeString).toTimeString().match(/^[\d:]*/)[0];
	},
	render: function render() {
		var _this = this;

		var events = undefined;
		if (this.props.events.length) {
			events = this.props.events.map(function (event) {
				return _this.getTime(event.createdAt) + " " + event.description;
			}).join("\n");
			return React.createElement(
				"pre",
				{ className: "events-panel" },
				events
			);
		} else {
			return React.createElement(
				"pre",
				{ className: "events-panel" },
				"Listening for new events..."
			);
		}
	}
});
});

require.register("javascripts/components/gather", function(exports, require, module) {
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _user = require("javascripts/components/user");

var React = require("react");
var helper = require("javascripts/helper");
var enslUrl = helper.enslUrl;
var rankVotes = helper.rankeVotes;
var hiveUrl = helper.hiveUrl;

var SelectPlayerButton = React.createClass({
	displayName: "SelectPlayerButton",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gatherer: React.PropTypes.object.isRequired
	},

	selectPlayer: function selectPlayer(e) {
		e.preventDefault();
		this.props.socket.emit("gather:select", {
			player: parseInt(e.target.value, 10)
		});
	},
	render: function render() {
		var button = undefined;
		if (this.props.gatherer.leader) {
			button = React.createElement(
				"button",
				{
					className: "btn btn-xs btn-default team-label",
					"data-disabled": "true" },
				"Leader"
			);
		} else if (this.props.gatherer.team !== "lobby") {
			button = React.createElement(
				"button",
				{
					"data-disabled": "true",
					className: "btn btn-xs btn-default team-label" },
				_.capitalize(this.props.gatherer.team)
			);
		} else {
			button = React.createElement(
				"button",
				{
					onClick: this.selectPlayer,
					value: this.props.gatherer.id,
					className: "btn btn-xs btn-primary team-label" },
				" Select"
			);
		}
		return button;
	}
});

var GathererList = React.createClass({
	displayName: "GathererList",
	memberList: function memberList() {
		var self = this;
		return this.props.gather.gatherers.filter(function (gatherer) {
			return gatherer.team === self.props.team;
		}).sort(function (gatherer) {
			return gatherer.leader ? 1 : -1;
		});
	},
	render: function render() {
		var extractGatherer = function extractGatherer(gatherer) {
			var image = undefined;
			if (gatherer.leader) {
				image = React.createElement("i", { className: "fa fa-star add-right" });
			}
			return React.createElement(
				"tr",
				{ key: gatherer.id },
				React.createElement(
					"td",
					{ className: "col-md-12" },
					image,
					gatherer.user.username,
					React.createElement(
						"span",
						{ className: "pull-right" },
						React.createElement(LifeformIcons, { gatherer: gatherer })
					)
				)
			);
		};
		var members = this.memberList().map(extractGatherer);
		return React.createElement(
			"table",
			{ className: "table" },
			React.createElement(
				"tbody",
				null,
				members
			)
		);
	}
});

var GatherTeams = React.createClass({
	displayName: "GatherTeams",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "row add-top" },
			React.createElement(
				"div",
				{ className: "col-sm-6" },
				React.createElement(
					"div",
					{ className: "panel panel-primary panel-light-background" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Marines"
					),
					React.createElement(GathererList, { gather: this.props.gather, team: "marine" })
				)
			),
			React.createElement(
				"div",
				{ className: "col-sm-6" },
				React.createElement(
					"div",
					{ className: "panel panel-primary panel-light-background" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Aliens"
					),
					React.createElement(GathererList, { gather: this.props.gather, team: "alien" })
				)
			)
		);
	}
});

var ElectionProgressBar = React.createClass({
	displayName: "ElectionProgressBar",
	componentDidMount: function componentDidMount() {
		var self = this;
		this.timer = setInterval(function () {
			self.forceUpdate();
		}, 900);
	},
	progress: function progress() {
		var interval = this.props.gather.election.interval;
		var startTime = new Date(this.props.gather.election.startTime).getTime();
		var msTranspired = Math.floor(new Date().getTime() - startTime);

		return {
			num: msTranspired,
			den: interval,
			barMessage: Math.floor((interval - msTranspired) / 1000) + "s remaining"
		};
	},
	componentWillUnmount: function componentWillUnmount() {
		clearInterval(this.timer);
	},
	render: function render() {
		return React.createElement(ProgressBar, { progress: this.progress() });
	}
});

var ProgressBar = React.createClass({
	displayName: "ProgressBar",
	render: function render() {
		var progress = this.props.progress;
		var style = {
			width: Math.round(progress.num / progress.den * 100) + "%"
		};
		var barMessage = progress.barMessage || "";
		return React.createElement(
			"div",
			{ className: "progress" },
			React.createElement(
				"div",
				{ className: "progress-bar progress-bar-striped active",
					"data-role": "progressbar",
					"data-aria-valuenow": progress.num,
					"data-aria-valuemin": "0",
					"data-aria-valuemax": progress.den,
					style: style },
				barMessage
			)
		);
	}
});

var GatherProgress = React.createClass({
	displayName: "GatherProgress",
	stateDescription: function stateDescription() {
		switch (this.props.gather.state) {
			case "gathering":
				return "Waiting for more gatherers.";
			case "election":
				return "Currently voting for team leaders.";
			case "selection":
				return "Waiting for leaders to pick teams.";
			case "done":
				return "Gather completed.";
			default:
				return "Initialising gather.";
		}
	},
	gatheringProgress: function gatheringProgress() {
		var num = this.props.gather.gatherers.length;
		var den = 12;
		var remaining = den - num;
		var message = remaining === 1 ? "Waiting for last player" : "Waiting for " + remaining + " more players";
		return {
			num: num,
			den: den,
			message: message
		};
	},
	electionProgress: function electionProgress() {
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
	selectionProgress: function selectionProgress() {
		var num = this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer.team !== "lobby") acc++;
			return acc;
		}, 0);
		var den = 12;

		return {
			num: num,
			den: den,
			message: num + " out of " + den + " players assigned. Waiting \n\t\t\t\ton " + _.capitalize(this.props.gather.pickingTurn) + "s to pick next..."
		};
	},
	render: function render() {
		var progress = undefined,
		    progressBar = undefined;
		var gatherState = this.props.gather.state;
		if (gatherState === 'gathering' && this.props.gather.gatherers.length) {
			progress = this.gatheringProgress();
			progressBar = React.createElement(ProgressBar, { progress: progress });
		} else if (gatherState === 'election') {
			progress = this.electionProgress();
			progressBar = React.createElement(ElectionProgressBar, _extends({}, this.props, { progress: progress }));
		} else if (gatherState === 'selection') {
			progress = this.selectionProgress();
			progressBar = React.createElement(ProgressBar, { progress: progress });
		}

		if (!progress) return false;

		return React.createElement(
			"div",
			{ className: "no-bottom" },
			React.createElement(
				"p",
				null,
				React.createElement(
					"strong",
					null,
					this.stateDescription()
				),
				" ",
				progress.message
			),
			progressBar
		);
	}
});

var JoinGatherButton = React.createClass({
	displayName: "JoinGatherButton",

	propTypes: {
		thisGatherer: React.PropTypes.object,
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired
	},

	componentDidMount: function componentDidMount() {
		var self = this;
		this.timer = setInterval(function () {
			self.forceUpdate();
		}, 30000);
	},
	componentWillUnmount: function componentWillUnmount() {
		clearInterval(this.timer);
	},
	joinGather: function joinGather(e) {
		e.preventDefault();
		this.props.socket.emit("gather:join");
	},
	leaveGather: function leaveGather(e) {
		e.preventDefault();
		this.props.socket.emit("gather:leave");
	},
	cooldownTime: function cooldownTime() {
		var user = this.props.user;
		if (!user) return false;
		var cooloffTime = this.props.gather.cooldown[user.id];
		if (!cooloffTime) return false;
		var timeRemaining = new Date(cooloffTime) - new Date();
		return timeRemaining > 0 ? timeRemaining : false;
	},
	render: function render() {
		var gather = this.props.gather;
		var thisGatherer = this.props.thisGatherer;
		if (thisGatherer) {
			return React.createElement(
				"button",
				{
					onClick: this.leaveGather,
					className: "btn btn-danger" },
				"Leave Gather"
			);
		}
		if (gather.state === 'gathering') {
			var cooldownTime = this.cooldownTime();
			if (cooldownTime) {
				return React.createElement(CooloffButton, { timeRemaining: cooldownTime });
			} else {
				return React.createElement(
					"button",
					{
						onClick: this.joinGather,
						className: "btn btn-success" },
					"Join Gather"
				);
			}
		}
		return false;
	}
});

var CooloffButton = React.createClass({
	displayName: "CooloffButton",

	propTypes: {
		timeRemaining: React.PropTypes.number.isRequired
	},

	timeRemaining: function timeRemaining() {
		return Math.floor(this.props.timeRemaining / 60000) + 1 + " minutes remaining";
	},
	render: function render() {
		return React.createElement(
			"button",
			{
				disabled: "true",
				className: "btn btn-success" },
			"Leaver Cooloff (",
			this.timeRemaining(),
			")"
		);
	}
});

var GatherActions = React.createClass({
	displayName: "GatherActions",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired,
		thisGatherer: React.PropTypes.object
	},

	voteRegather: function voteRegather(e) {
		e.preventDefault(e);
		this.props.socket.emit("gather:vote", {
			regather: e.target.value === "true"
		});
	},
	regatherVotes: function regatherVotes() {
		var gather = this.props.gather;
		if (!gather) return 0;
		return gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer.regatherVote) acc++;
			return acc;
		}, 0);
	},
	render: function render() {
		var regatherButton = undefined;
		var user = this.props.user;
		var gather = this.props.gather;
		var socket = this.props.socket;
		var thisGatherer = this.props.thisGatherer;
		if (thisGatherer) {
			var regatherVotes = this.regatherVotes();
			if (thisGatherer.regatherVote) {
				regatherButton = React.createElement(
					"button",
					{ value: "false", onClick: this.voteRegather,
						className: "btn btn-danger" },
					"Voted Regather (" + regatherVotes + "/8)"
				);
			} else {
				regatherButton = React.createElement(
					"button",
					{ value: "true", onClick: this.voteRegather,
						className: "btn btn-danger" },
					"Vote Regather (" + regatherVotes + "/8)"
				);
			}
		}

		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "text-right" },
				React.createElement(
					"ul",
					{ className: "list-inline no-bottom" },
					React.createElement(
						"li",
						null,
						regatherButton
					),
					React.createElement(
						"li",
						null,
						React.createElement(JoinGatherButton, { gather: gather, thisGatherer: thisGatherer,
							user: user, socket: socket })
					)
				)
			)
		);
	}
});

var VoteButton = React.createClass({
	displayName: "VoteButton",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		candidate: React.PropTypes.object.isRequired,
		thisGatherer: React.PropTypes.object
	},

	cancelVote: function cancelVote(e) {
		this.props.socket.emit("gather:vote", {
			leader: {
				candidate: null
			}
		});
	},
	vote: function vote(e) {
		e.preventDefault();
		this.props.socket.emit("gather:vote", {
			leader: {
				candidate: parseInt(e.target.value, 10)
			}
		});
	},
	stopGatherMusic: function stopGatherMusic() {
		soundController.stop();
	},
	render: function render() {
		var candidate = this.props.candidate;
		var thisGatherer = this.props.thisGatherer;
		if (thisGatherer === null) {
			return false;
		}
		if (thisGatherer.leaderVote === candidate.id) {
			return React.createElement(
				"button",
				{
					onClick: this.cancelVote,
					className: "btn btn-xs btn-success vote-button" },
				"Voted"
			);
		} else {
			return React.createElement(
				"button",
				{
					onClick: this.vote,
					className: "btn btn-xs btn-primary vote-button",
					value: candidate.id },
				"Vote"
			);
		}
	}
});

var ServerVoting = React.createClass({
	displayName: "ServerVoting",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired,
		thisGatherer: React.PropTypes.object,
		servers: React.PropTypes.array.isRequired
	},

	voteHandler: function voteHandler(serverId) {
		var _this = this;

		return function (e) {
			e.preventDefault();
			_this.props.socket.emit("gather:vote", {
				server: {
					id: serverId
				}
			});
		};
	},
	votesForServer: function votesForServer(server) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer.serverVote.some(function (voteId) {
				return voteId === server.id;
			})) acc++;
			return acc;
		}, 0);
	},
	render: function render() {
		var self = this;
		var thisGatherer = self.props.thisGatherer;
		var servers = self.props.servers.sort(function (a, b) {
			var aVotes = self.votesForServer(a);
			var bVotes = self.votesForServer(b);
			return bVotes - aVotes;
		}).map(function (server) {
			var votes = self.votesForServer(server);
			var style = thisGatherer.serverVote.some(function (voteId) {
				return voteId === server.id;
			}) ? "list-group-item list-group-item-success" : "list-group-item";
			return React.createElement(
				"a",
				{ href: "#",
					className: style,
					onClick: self.voteHandler(server.id),
					key: server.id },
				React.createElement(
					"span",
					{ className: "badge" },
					votes
				),
				server.name || server.description
			);
		});

		var votes = thisGatherer.serverVote.length;

		return React.createElement(
			"div",
			{ className: "panel panel-primary" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				votes === 2 ? "Server Votes" : "Please Vote for a Server. " + (2 - votes) + " votes remaining"
			),
			React.createElement(
				"div",
				{ className: "list-group gather-voting" },
				servers
			)
		);
	}
});

var MapVoting = React.createClass({
	displayName: "MapVoting",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired,
		thisGatherer: React.PropTypes.object,
		maps: React.PropTypes.array.isRequired
	},

	voteHandler: function voteHandler(mapId) {
		var _this2 = this;

		return function (e) {
			e.preventDefault();
			_this2.props.socket.emit("gather:vote", {
				map: {
					id: mapId
				}
			});
		};
	},
	votesForMap: function votesForMap(map) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			if (gatherer.mapVote.some(function (voteId) {
				return voteId === map.id;
			})) acc++;
			return acc;
		}, 0);
	},
	render: function render() {
		var self = this;
		var thisGatherer = self.props.thisGatherer;
		var maps = self.props.maps.sort(function (a, b) {
			var aVotes = self.votesForMap(a);
			var bVotes = self.votesForMap(b);
			return bVotes - aVotes;
		}).map(function (map) {
			var votes = self.votesForMap(map);
			var style = thisGatherer.mapVote.some(function (voteId) {
				return voteId === map.id;
			}) ? "list-group-item list-group-item-success" : "list-group-item";
			return React.createElement(
				"a",
				{ href: "#",
					key: map.id,
					onClick: self.voteHandler(map.id),
					className: style },
				React.createElement(
					"span",
					{ className: "badge" },
					votes
				),
				map.name
			);
		});

		var votes = thisGatherer.mapVote.length;

		return React.createElement(
			"div",
			{ className: "panel panel-primary" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				votes === 2 ? "Map Votes" : "Please Vote for a Map. " + (2 - votes) + " votes remaining"
			),
			React.createElement(
				"div",
				{ className: "list-group gather-voting" },
				maps
			)
		);
	}
});

var Gather = exports.Gather = React.createClass({
	displayName: "Gather",

	propTypes: {
		thisGatherer: React.PropTypes.object,
		maps: React.PropTypes.array.isRequired,
		servers: React.PropTypes.array.isRequired,
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired
	},

	render: function render() {
		var socket = this.props.socket;
		var gather = this.props.gather;
		var thisGatherer = this.props.thisGatherer;
		var servers = this.props.servers;
		var maps = this.props.maps;
		var user = this.props.user;
		if (gather === null) return React.createElement("div", null);

		var voting = undefined;
		if (thisGatherer) {
			var state = gather.state;
			if (state === 'gathering' || state === 'election') {
				voting = React.createElement(
					"div",
					{ className: "row add-top" },
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(MapVoting, { gather: gather, maps: maps,
							socket: socket, thisGatherer: thisGatherer })
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(ServerVoting, { gather: gather, servers: servers,
							socket: socket, thisGatherer: thisGatherer })
					)
				);
			} else {
				voting = React.createElement(GatherVotingResults, { gather: gather,
					servers: servers,
					maps: maps });
			}
		}

		var gatherTeams = undefined;
		if (gather.state === 'selection') {
			gatherTeams = React.createElement(GatherTeams, { gather: gather });
		}

		if (gather.gatherers.length > 0) {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ className: "panel panel-primary add-bottom" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Current Gather"
					),
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(GatherProgress, { gather: gather }),
						React.createElement(GatherActions, { gather: gather, user: user, thisGatherer: thisGatherer,
							socket: socket })
					)
				),
				React.createElement(Gatherers, { gather: gather, user: user,
					soundController: this.props.soundController,
					thisGatherer: thisGatherer, socket: socket }),
				gatherTeams,
				voting
			);
		} else {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ className: "panel panel-primary add-bottom" },
					React.createElement(
						"div",
						{ className: "panel-heading" },
						"Current Gather"
					)
				),
				React.createElement(Gatherers, { gather: gather, user: user, thisGatherer: thisGatherer,
					socket: socket })
			);
		}
	}
});

var LifeformIcons = exports.LifeformIcons = React.createClass({
	displayName: "LifeformIcons",
	availableLifeforms: function availableLifeforms() {
		return ["skulk", "gorge", "lerk", "fade", "onos", "commander"];
	},
	gathererLifeforms: function gathererLifeforms() {
		var lifeforms = [];
		var gatherer = this.props.gatherer;
		var abilities = gatherer.user.profile.abilities;
		for (var attr in abilities) {
			if (abilities[attr]) lifeforms.push(_.capitalize(attr));
		}
		return lifeforms;
	},
	render: function render() {
		var lifeforms = this.gathererLifeforms();
		var availableLifeforms = this.availableLifeforms();
		var icons = availableLifeforms.map(function (lifeform) {
			var containsAbility = lifeforms.some(function (gathererLifeform) {
				return gathererLifeform.toLowerCase() === lifeform.toLowerCase();
			});
			if (containsAbility) {
				return React.createElement("img", {
					className: "lifeform-icon",
					key: lifeform,
					src: "/" + lifeform.toLowerCase() + ".png" });
			} else {
				return React.createElement("img", {
					className: "lifeform-icon",
					key: lifeform,
					src: "/blank.gif" });
			}
		});
		return React.createElement(
			"span",
			{ className: "add-right hidden-xs" },
			icons
		);
	}
});

var Gatherers = React.createClass({
	displayName: "Gatherers",

	propTypes: {
		user: React.PropTypes.object,
		thisGatherer: React.PropTypes.object,
		socket: React.PropTypes.object.isRequired,
		gather: React.PropTypes.object.isRequired
	},

	joinGather: function joinGather(e) {
		e.preventDefault();
		this.props.socket.emit("gather:join");
	},
	bootGatherer: function bootGatherer(e) {
		e.preventDefault();
		this.props.socket.emit("gather:leave", {
			gatherer: parseInt(e.target.value, 10) || null
		});
	},
	render: function render() {
		var _this3 = this;

		var self = this;
		var user = this.props.user;
		var socket = this.props.socket;
		var gather = this.props.gather;
		var thisGatherer = this.props.thisGatherer;
		var admin = user && user.admin || user && user.moderator;
		var gatherers = gather.gatherers.sort(function (a, b) {
			return (b.user.hive.skill || 1000) - (a.user.hive.skill || 1000);
		}).map(function (gatherer) {
			var country = undefined;
			if (gatherer.user.country) {
				country = React.createElement("img", { src: "/blank.gif",
					className: "flag flag-" + gatherer.user.country.toLowerCase(),
					alt: gatherer.user.country });
			};

			var skill = gatherer.user.profile.skill || "Not Available";

			var hiveStats = [];
			if (gatherer.user.hive.skill) hiveStats.push(gatherer.user.hive.skill + " ELO");

			if (gatherer.user.hive.playTime) {
				hiveStats.push(Math.floor(gatherer.user.hive.playTime / 3600) + " Hours");
			}

			var hive = hiveStats.length ? hiveStats.join(", ") : "Not Available";

			var team = gatherer.user.team ? gatherer.user.team.name : "None";

			var action = undefined;
			if (gather.state === "election") {
				var votes = gather.gatherers.reduce(function (acc, voter) {
					if (voter.leaderVote === gatherer.id) acc++;
					return acc;
				}, 0);
				action = React.createElement(
					"span",
					null,
					React.createElement(
						"span",
						{ className: "badge add-right" },
						votes + " votes"
					),
					React.createElement(VoteButton, {
						thisGatherer: thisGatherer,
						soundController: _this3.props.soundController,
						candidate: gatherer })
				);
			}

			if (gather.state === 'selection') {
				if (thisGatherer && thisGatherer.leader && thisGatherer.team === gather.pickingTurn) {
					action = React.createElement(
						"span",
						null,
						React.createElement(SelectPlayerButton, { gatherer: gatherer })
					);
				} else {
					if (gatherer.leader) {
						action = React.createElement(
							"span",
							{ className: "label label-padding \n\t\t\t\t\t\t\tlabel-" + gatherer.team + " \n\t\t\t\t\t\t\tteam-label" },
							"Leader"
						);
					} else if (gatherer.team !== "lobby") {
						action = React.createElement(
							"span",
							{ className: "label label-padding \n\t\t\t\t\t\t\tlabel-" + gatherer.team + " \n\t\t\t\t\t\t\tteam-label" },
							_.capitalize(gatherer.team)
						);
					} else {
						action = React.createElement(
							"span",
							{ className: "label label-padding label-default team-label" },
							"Lobby"
						);
					}
				}
			}

			var adminOptions = undefined;
			if (admin) {
				adminOptions = [React.createElement("hr", null), React.createElement(
					"dt",
					null,
					"Admin"
				), React.createElement(
					"dd",
					null,
					React.createElement(
						"button",
						{
							className: "btn btn-xs btn-danger",
							value: gatherer.user.id,
							onClick: _this3.bootGatherer },
						"Boot from Gather"
					),
					" ",
					React.createElement(_user.AssumeUserIdButton, { socket: socket,
						gatherer: gatherer, currentUser: user })
				)];
			}

			var tabColor = gatherer.team !== "lobby" ? "panel-" + gatherer.team : "panel-info";
			return React.createElement(
				"div",
				{ className: "panel " + tabColor + " gatherer-panel",
					key: gatherer.user.id, "data-userid": gatherer.user.id },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					React.createElement(
						"h4",
						{ className: "panel-title" },
						country,
						" ",
						gatherer.user.username,
						React.createElement(
							"span",
							{ className: "pull-right" },
							React.createElement(
								"a",
								{ "data-toggle": "collapse",
									href: "#" + gatherer.user.id.toString() + "-collapse",
									"aria-expanded": "false",
									className: "btn btn-xs btn-primary add-right",
									"aria-controls": gatherer.user.id.toString() + "-collapse" },
								"Info ",
								React.createElement("span", { className: "caret" })
							),
							React.createElement(LifeformIcons, { gatherer: gatherer }),
							action
						)
					)
				),
				React.createElement(
					"div",
					{ id: gatherer.user.id.toString() + "-collapse",
						className: "panel-collapse collapse out" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"dl",
							{ className: "dl-horizontal" },
							React.createElement(
								"dt",
								null,
								"Skill Level"
							),
							React.createElement(
								"dd",
								null,
								skill
							),
							React.createElement(
								"dt",
								null,
								"Team"
							),
							React.createElement(
								"dd",
								null,
								team
							),
							React.createElement(
								"dt",
								null,
								"Hive Stats"
							),
							React.createElement(
								"dd",
								null,
								hive
							),
							React.createElement(
								"dt",
								null,
								"Links"
							),
							React.createElement(
								"dd",
								null,
								React.createElement(
									"a",
									{ href: enslUrl(gatherer),
										className: "btn btn-xs btn-primary",
										target: "_blank" },
									"ENSL Profile"
								),
								" ",
								React.createElement(
									"a",
									{ href: hiveUrl(gatherer),
										className: "btn btn-xs btn-primary",
										target: "_blank" },
									"Hive Profile"
								)
							),
							adminOptions
						)
					)
				)
			);
		});
		if (gather.gatherers.length) {
			return React.createElement(
				"div",
				{ "class": "panel-group",
					role: "tablist",
					"aria-multiselectable": "true",
					id: "gatherers-panel" },
				gatherers
			);
		} else {
			return React.createElement(
				"div",
				{ className: "panel panel-primary add-bottom" },
				React.createElement(
					"div",
					{ className: "panel-body text-center join-hero" },
					React.createElement(
						"button",
						{
							onClick: this.joinGather,
							className: "btn btn-success btn-lg" },
						"Start a Gather"
					)
				)
			);
		}
	}
});

var CompletedGather = React.createClass({
	displayName: "CompletedGather",
	completionDate: function completionDate() {
		var d = new Date(this.props.gather.done.time);
		if (d) {
			return d.toLocaleTimeString();
		} else {
			return "Completed Gather";
		}
	},
	getInitialState: function getInitialState() {
		return {
			show: !!this.props.show
		};
	},
	toggleGatherInfo: function toggleGatherInfo() {
		var newState = !this.state.show;
		this.setState({
			show: newState
		});
	},
	render: function render() {
		var gatherInfo = [];
		var gather = this.props.gather;
		var maps = this.props.maps;
		var servers = this.props.servers;
		if (this.state.show) {
			gatherInfo.push(React.createElement(GatherTeams, { gather: gather }));
			gatherInfo.push(React.createElement(GatherVotingResults, { gather: gather,
				maps: maps,
				servers: servers }));
		}
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "panel panel-success add-bottom pointer",
					onClick: this.toggleGatherInfo },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					React.createElement(
						"strong",
						null,
						this.completionDate()
					)
				)
			),
			gatherInfo
		);
	}
});

var GatherVotingResults = React.createClass({
	displayName: "GatherVotingResults",

	// Returns an array of ids voted for e.g. [1,2,5,1,1,3,2]
	countVotes: function countVotes(voteType) {
		return this.props.gather.gatherers.reduce(function (acc, gatherer) {
			var votes = gatherer[voteType];

			// Temporary fix because some mapvotes are ints and not arrays
			if (!Array.isArray(votes)) votes = [votes];

			if (votes.length > 0) votes.forEach(function (vote) {
				return acc.push(vote);
			});
			return acc;
		}, []);
	},
	selectedMaps: function selectedMaps() {
		return rankVotes(this.countVotes('mapVote'), this.props.maps).slice(0, 2);
	},
	selectedServer: function selectedServer() {
		return rankVotes(this.countVotes('serverVote'), this.props.servers).slice(0, 1);
	},
	render: function render() {
		var maps = this.selectedMaps();
		var server = this.selectedServer().pop();
		var password = undefined;
		if (server.password) {
			password = [React.createElement(
				"dt",
				null,
				"Password"
			), React.createElement(
				"dd",
				null,
				server.password
			)];
		}
		return React.createElement(
			"div",
			{ className: "panel panel-primary" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Server"
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"dl",
					{ className: "dl-horizontal" },
					React.createElement(
						"dt",
						null,
						"Maps"
					),
					React.createElement(
						"dd",
						null,
						maps.map(function (map) {
							return map.name;
						}).join(" & ")
					),
					React.createElement(
						"dt",
						null,
						"Server"
					),
					React.createElement(
						"dd",
						null,
						server.name
					),
					React.createElement(
						"dt",
						null,
						"Address"
					),
					React.createElement(
						"dd",
						null,
						server.ip,
						":",
						server.port
					),
					password
				),
				React.createElement(
					"p",
					null,
					React.createElement(
						"a",
						{ href: "steam://run/4920/connect+%20" + server.ip + ":" + server.port + "%20+password%20" + server.password,
							className: "btn btn-primary max-width" },
						"Join Server"
					)
				)
			)
		);
	}
});

var ArchivedGathers = exports.ArchivedGathers = React.createClass({
	displayName: "ArchivedGathers",

	propTypes: {
		archive: React.PropTypes.array.isRequired,
		servers: React.PropTypes.array.isRequired,
		maps: React.PropTypes.array.isRequired
	},

	render: function render() {
		var _this4 = this;

		var archive = this.props.archive.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt);
		}).map(function (archivedGather, index) {
			return React.createElement(CompletedGather, {
				id: archivedGather.gather.done.time,
				show: index === 0 ? true : false,
				gather: archivedGather.gather,
				maps: _this4.props.maps,
				servers: _this4.props.servers });
		});

		return React.createElement(
			"div",
			{ className: "panel panel-primary" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Archived Gathers"
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				archive
			)
		);
	}
});
});

require.register("javascripts/components/main", function(exports, require, module) {
"use strict";

var _event = require("javascripts/components/event");

var _user = require("javascripts/components/user");

var _sound = require("javascripts/components/sound");

var _teamspeak = require("javascripts/components/teamspeak");

var _settings = require("javascripts/components/settings");

var _message = require("javascripts/components/message");

var _gather = require("javascripts/components/gather");

var React = require("react");
var Sound = require("javascripts/components/sound");
var SoundController = Sound.SoundController;
var helper = require("javascripts/helper");
var storageAvailable = helper.storageAvailable;
var SplashScreen = React.createClass({
	displayName: "SplashScreen",
	getInitialState: function getInitialState() {
		return {
			status: "connecting",
			socket: null
		};
	},
	componentDidMount: function componentDidMount() {
		var _this = this;

		var socketUrl = window.location.protocol + "//" + window.location.host;
		var socket = io(socketUrl).on("connect", function () {
			console.log("Connected");
			_this.setState({ status: "connected" });
			socket.on("reconnect", function () {
				console.log("Reconnected");
			}).on("disconnect", function () {
				console.log("Disconnected");
			});
		}).on("error", function (error) {
			console.log(error);
			if (error === "Authentication Failed") {
				_this.setState({ status: "authFailed" });
			} else if (error === "Gather Banned") {
				_this.setState({ status: "banned" });
			}
		});

		this.setState({ socket: socket });
	},
	render: function render() {
		var status = this.state.status;

		if (status === "connected") {
			return React.createElement(App, { socket: this.state.socket });
		}

		var splash = undefined;
		if (status === "authFailed") {
			splash = React.createElement(AuthFailedSplash, null);
		} else if (status === "banned") {
			splash = React.createElement(BannedSplash, null);
		} else if (status === "connecting") {
			splash = React.createElement(ConnectingSplash, null);
		}

		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ style: { "minHeight": "750px" } },
				React.createElement(
					"div",
					{ className: "container-fluid" },
					splash
				)
			)
		);
	}
});

var AuthFailedSplash = React.createClass({
	displayName: "AuthFailedSplash",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "row", id: "auth-required" },
			React.createElement(
				"div",
				{ className: "col-lg-6 col-lg-offset-3" },
				React.createElement(
					"div",
					{ className: "add-top jumbotron jumbo-auth text-center" },
					React.createElement(
						"div",
						null,
						React.createElement("img", { src: "/ensl_logo.png", alt: "ENSL Logo" })
					),
					React.createElement(
						"h3",
						null,
						"You need to be logged in to the ENSL website to access gathers"
					),
					React.createElement(
						"h3",
						null,
						React.createElement(
							"small",
							null,
							"If you are logged on, try visiting a few pages on ENSL.org so the server can update your cookies"
						)
					),
					React.createElement(
						"h3",
						null,
						React.createElement(
							"small",
							null,
							"If this error persists please contact an admin to fix it"
						)
					),
					React.createElement("br", null),
					React.createElement(
						"p",
						null,
						React.createElement(
							"a",
							{ className: "btn btn-primary btn-lg", href: "www.ensl.org", role: "button" },
							"Go to website"
						)
					)
				)
			)
		);
	}
});

var BannedSplash = React.createClass({
	displayName: "BannedSplash",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
				"div",
				{ className: "col-lg-6 col-lg-offset-3" },
				React.createElement(
					"div",
					{ className: "add-top jumbotron jumbo-auth text-center" },
					React.createElement(
						"div",
						null,
						React.createElement("img", { src: "/ensl_logo.png", alt: "ENSL Logo" })
					),
					React.createElement(
						"h3",
						null,
						"You're currently barred from joining gathers"
					),
					React.createElement(
						"h3",
						null,
						React.createElement(
							"small",
							null,
							"Either wait for the ban to expire or talk to an admin to get it lifted"
						)
					),
					React.createElement("br", null),
					React.createElement(
						"p",
						null,
						React.createElement(
							"a",
							{ className: "btn btn-primary btn-lg", href: "http://www.ensl.org/bans", role: "button" },
							"See the ban list"
						)
					)
				)
			)
		);
	}
});

var ConnectingSplash = React.createClass({
	displayName: "ConnectingSplash",
	render: function render() {
		return React.createElement(
			"div",
			{ className: "row", id: "authenticating" },
			React.createElement(
				"div",
				{ className: "col-lg-6 col-lg-offset-3" },
				React.createElement(
					"div",
					{ className: "add-top jumbotron jumbo-auth text-center" },
					React.createElement(
						"div",
						null,
						React.createElement("img", { src: "/ensl_logo.png", className: "jumbo-img", alt: "ENSL Logo" })
					),
					React.createElement("br", null),
					React.createElement(
						"h3",
						null,
						"Authenticating your ENSL account"
					),
					React.createElement("br", null),
					React.createElement(
						"div",
						null,
						React.createElement("img", { src: "/spinner.svg", className: "spinner", alt: "Loading" })
					)
				)
			)
		);
	}
});

var App = React.createClass({
	displayName: "App",

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	getInitialState: function getInitialState() {
		var updateTitle = true;
		var showEventsPanel = true;

		if (storageAvailable('localStorage')) {
			if (localStorage.getItem("updateTitle") !== null) {
				updateTitle = JSON.parse(localStorage.getItem("updateTitle"));
			}
			if (localStorage.getItem("showEventsPanel") !== null) {
				showEventsPanel = JSON.parse(localStorage.getItem("showEventsPanel"));
			}
		}

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
			events: [],
			updateTitle: updateTitle,
			showEventsPanel: showEventsPanel,
			soundController: new SoundController(),
			showMessageBox: true,
			collapseMenu: false,
			connectionState: "connected"
		};
	},
	updateTitle: function updateTitle() {
		var gather = this.state.gather;
		if (gather && this.state.updateTitle) {
			document.title = "NSL Gathers (" + gather.gatherers.length + "/12)";
			return;
		}
		document.title = "NSL Gathers";
	},
	toggleEventsPanel: function toggleEventsPanel(event) {
		var newState = event.target.checked;
		this.setState({ showEventsPanel: newState });
		if (storageAvailable('localStorage')) {
			localStorage.setItem("showEventsPanel", newState);
		}
	},
	toggleUpdateTitle: function toggleUpdateTitle(event) {
		var newState = event.target.checked;
		this.setState({ updateTitle: newState });
		if (storageAvailable('localStorage')) {
			localStorage.setItem("updateTitle", newState);
		}
		this.updateTitle();
	},
	thisGatherer: function thisGatherer() {
		var gather = this.state.gather;
		var user = this.state.user;
		if (gather && user && gather.gatherers.length) {
			return gather.gatherers.filter(function (gatherer) {
				return gatherer.id === user.id;
			}).pop() || null;
		}
		return null;
	},
	componentDidMount: function componentDidMount() {
		var _this2 = this;

		var self = this;
		var socket = this.props.socket;
		var soundController = this.state.soundController;

		this.updateTitle();

		socket.on('stateChange', function (data) {
			var state = data.state;

			if (state.from === 'gathering' && state.to === 'election' && _this2.thisGatherer()) {
				soundController.playGatherMusic();
			}

			if (state.from === 'election' && state.to === 'gathering') {
				soundController.stop();
			}
		});

		socket.on('event:append', function (data) {
			var events = self.state.events;
			events.unshift(data);
			self.setState({
				events: events.slice(0, 20)
			});
		});

		socket.on('users:update', function (data) {
			return self.setState({
				users: data.users,
				user: data.currentUser
			});
		});

		socket.on("message:append", function (data) {
			self.setState({
				messages: self.state.messages.concat(data.messages).sort(function (a, b) {
					return new Date(a.createdAt) - new Date(b.createdAt);
				})
			});
		});

		socket.on("message:refresh", function (data) {
			self.setState({
				messages: data.messages
			});
		});

		socket.on("gather:refresh", function (data) {
			self.setState({
				gather: data.gather,
				maps: data.maps,
				servers: data.servers,
				previousGather: data.previousGather
			});
			_this2.updateTitle();
		});

		socket.on("gather:archive:refresh", function (data) {
			self.setState({
				archive: data.archive,
				maps: data.maps,
				servers: data.servers
			});
		});

		socket.on("connect", function () {
			_this2.setState({ connectionState: "connected" });
		});

		socket.on("disconnect", function () {
			_this2.setState({ connectionState: "disconnected" });
		});

		socket.on("reconnecting", function () {
			_this2.setState({ connectionState: "reconnecting" });
		});

		socket.on("reconnect", function () {
			_this2.setState({ connectionState: "connected" });
		});

		socket.emit("users:refresh");
		socket.emit("message:refresh");
		socket.emit("gather:refresh");
	},
	toggleMessageBox: function toggleMessageBox(e) {
		e.preventDefault();
		console.log("FOO");
		this.setState({
			showMessageBox: !this.state.showMessageBox
		});
	},
	toggleCollapseMenu: function toggleCollapseMenu(e) {
		e.preventDefault();
		this.setState({
			collapseMenu: !this.state.collapseMenu
		});
	},
	render: function render() {
		var socket = this.props.socket;

		var eventsPanel = undefined;
		if (this.state.showEventsPanel) {
			eventsPanel = React.createElement(_event.Events, { events: this.state.events });
		}

		var profileModal = undefined,
		    chatroom = undefined,
		    currentUser = undefined;
		if (this.state.user) {
			profileModal = React.createElement(_user.ProfileModal, { user: this.state.user });
			chatroom = React.createElement(_message.Chatroom, { messages: this.state.messages,
				user: this.state.user, socket: socket });
			currentUser = React.createElement(
				"ul",
				{ className: "nav navbar-top-links navbar-right", id: "currentuser" },
				React.createElement(_user.CurrentUser, { user: this.state.user })
			);
		}

		var user = this.state.user;
		var username = undefined,
		    avatar = undefined;
		if (user) {
			username = user.username;
			avatar = user.avatar;
		}

		var appClass = ["skin-blue", "sidebar-mini", "fixed"];
		if (this.state.showMessageBox) appClass.push("control-sidebar-open");
		if (this.state.collapseMenu) appClass.push("sidebar-collapse");

		var connectionStatus = undefined;
		var connectionState = this.state.connectionState;
		if (connectionState === "connected") {
			connectionStatus = React.createElement(
				"a",
				{ href: "#" },
				React.createElement("i", { className: "fa fa-circle text-success" }),
				" Online"
			);
		} else if (connectionState === "reconnecting") {
			connectionStatus = React.createElement(
				"a",
				{ href: "#" },
				React.createElement("i", { className: "fa fa-circle text-warning" }),
				" Reconnecting"
			);
		} else if (connectionState === "disconnected") {
			connectionStatus = React.createElement(
				"a",
				{ href: "#" },
				React.createElement("i", { className: "fa fa-circle text-danger" }),
				" Disconnected"
			);
		}

		return React.createElement(
			"div",
			{ className: appClass.join(" ") },
			React.createElement(
				"header",
				{ className: "main-header" },
				React.createElement(
					"a",
					{ href: "/", className: "logo" },
					React.createElement(
						"span",
						{ className: "logo-mini" },
						"NSL Gathers"
					),
					React.createElement(
						"span",
						{ className: "logo-lg" },
						"NSL Gathers"
					)
				),
				React.createElement(
					"nav",
					{ className: "navbar navbar-static-top", role: "navigation" },
					React.createElement(
						"a",
						{ href: "#", className: "sidebar-toggle", onClick: this.toggleCollapseMenu, role: "button" },
						React.createElement(
							"span",
							{ className: "sr-only" },
							"Toggle navigation"
						)
					),
					React.createElement(
						"div",
						{ className: "navbar-custom-menu" },
						React.createElement(
							"ul",
							{ className: "nav navbar-nav" },
							React.createElement(
								"li",
								{ className: "dropdown messages-menu" },
								React.createElement(
									"a",
									{ href: "#" },
									React.createElement("i", { className: "fa fa-headphones" })
								)
							),
							React.createElement(
								"li",
								{ className: "dropdown messages-menu" },
								React.createElement(
									"a",
									{ href: "#" },
									React.createElement("i", { className: "fa fa-newspaper-o" }),
									React.createElement(
										"span",
										{ className: "label label-success" },
										"4"
									)
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#", onClick: this.toggleMessageBox },
									React.createElement("i", { className: "fa fa-comment" })
								)
							)
						)
					)
				)
			),
			React.createElement(
				"aside",
				{ className: "main-sidebar" },
				React.createElement(
					"section",
					{ className: "sidebar", style: { height: "auto" } },
					React.createElement(
						"div",
						{ className: "user-panel" },
						React.createElement(
							"div",
							{ className: "pull-left image" },
							React.createElement("img", { src: avatar, className: "img-circle", alt: "User Image" })
						),
						React.createElement(
							"div",
							{ className: "pull-left info" },
							React.createElement(
								"p",
								null,
								username
							),
							connectionStatus
						)
					),
					React.createElement(
						"ul",
						{ className: "sidebar-menu" },
						React.createElement(
							"li",
							{ className: "header" },
							"MAIN NAVIGATION"
						),
						React.createElement(
							"li",
							null,
							React.createElement(
								"a",
								{ href: "#" },
								React.createElement("i", { className: "fa fa-dashboard" }),
								" ",
								React.createElement(
									"span",
									null,
									"Online"
								)
							)
						),
						React.createElement(
							"li",
							null,
							React.createElement(
								"a",
								{ href: "#" },
								React.createElement("i", { className: "fa fa-dashboard" }),
								" ",
								React.createElement(
									"span",
									null,
									"Teamspeak"
								)
							)
						),
						React.createElement(
							"li",
							null,
							React.createElement(
								"a",
								{ href: "#" },
								React.createElement("i", { className: "fa fa-dashboard" }),
								" ",
								React.createElement(
									"span",
									null,
									"Info"
								)
							)
						)
					)
				)
			),
			React.createElement(
				"div",
				{ className: "content-wrapper", style: { "minHeight": "916px" } },
				React.createElement(
					"section",
					{ className: "content-header" },
					React.createElement(
						"h1",
						null,
						"Gathers",
						React.createElement(
							"small",
							null,
							"beta"
						)
					)
				),
				React.createElement(
					"section",
					{ className: "content" },
					React.createElement(
						"p",
						null,
						"Foo"
					)
				)
			),
			React.createElement(
				"aside",
				{ className: "control-sidebar control-sidebar-dark", style: { "position": "fixed", "height": "auto" } },
				React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						null,
						React.createElement(
							"h3",
							{ className: "control-sidebar-heading" },
							"Recent Activity"
						),
						React.createElement(
							"ul",
							{ className: "control-sidebar-menu" },
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "#" },
									React.createElement("i", { className: "menu-icon fa fa-birthday-cake bg-red" }),
									React.createElement(
										"div",
										{ className: "menu-info" },
										React.createElement(
											"h4",
											{ className: "control-sidebar-subheading" },
											"Langdon's Birthday"
										),
										React.createElement(
											"p",
											null,
											"Will be 23 on April 24th"
										)
									)
								)
							)
						)
					)
				)
			),
			React.createElement("div", { className: "control-sidebar-bg", style: { "position": "fixed", "height": "auto" } })
		);

		return React.createElement(
			"div",
			{ id: "wrapper" },
			React.createElement(
				"nav",
				{ className: "navbar navbar-default navbar-static-top",
					role: "navigation",
					style: { marginBottom: "0" } },
				React.createElement(
					"div",
					{ className: "navbar-header" },
					React.createElement(
						"a",
						{ className: "navbar-brand", href: "/" },
						"NSL Gathers ",
						React.createElement(
							"small",
							null,
							React.createElement(
								"i",
								null,
								"Alpha"
							)
						)
					)
				),
				currentUser,
				React.createElement(
					"ul",
					{ className: "nav navbar-top-links navbar-right", id: "soundcontroller" },
					React.createElement(_sound.SoundPanel, { soundController: this.state.soundController })
				),
				React.createElement(_teamspeak.TeamSpeakButton, null),
				React.createElement(
					"ul",
					{ className: "nav navbar-top-links navbar-right" },
					React.createElement(
						"li",
						{ className: "dropdown" },
						React.createElement(
							"a",
							{ href: "#" },
							"Info  ",
							React.createElement("i", { className: "fa fa-caret-down" })
						),
						React.createElement(
							"ul",
							{ className: "dropdown-menu" },
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "https://github.com/cblanc/sws_gathers", target: "_blank" },
									React.createElement(
										"i",
										{ className: "fa fa-github" },
										" "
									),
									" Github"
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "http://steamcommunity.com/id/nslgathers", target: "_blank" },
									React.createElement(
										"i",
										{ className: "fa fa-external-link" },
										" "
									),
									" Steam Bot"
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "http://www.ensl.org/articles/464", target: "_blank" },
									React.createElement(
										"i",
										{ className: "fa fa-external-link" },
										" "
									),
									" Gather Rules"
								)
							),
							React.createElement(
								"li",
								null,
								React.createElement(
									"a",
									{ href: "/messages", target: "_blank" },
									React.createElement(
										"i",
										{ className: "fa fa-external-link" },
										" "
									),
									" Message Archive"
								)
							)
						)
					)
				)
			),
			React.createElement(_user.AdminPanel, { socket: socket }),
			React.createElement(_settings.SettingsPanel, {
				toggleEventsPanel: this.toggleEventsPanel,
				showEventsPanel: this.state.showEventsPanel,
				toggleUpdateTitle: this.toggleUpdateTitle,
				updateTitle: this.state.updateTitle }),
			React.createElement(_teamspeak.TeamSpeakModal, null),
			profileModal,
			React.createElement(
				"div",
				{ style: { minHeight: "750px" } },
				React.createElement(
					"div",
					{ className: "container-fluid" },
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-2 hidden-xs" },
							React.createElement(
								"ul",
								{ className: "nav", id: "side-menu" },
								React.createElement(_user.UserMenu, { users: this.state.users, user: this.state.user,
									socket: socket })
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-4", id: "chatroom" },
							chatroom
						),
						React.createElement(
							"div",
							{ className: "col-md-6", id: "gathers" },
							React.createElement(_gather.Gather, {
								socket: socket,
								maps: this.state.maps,
								user: this.state.user,
								gather: this.state.gather,
								servers: this.state.servers,
								thisGatherer: this.thisGatherer(),
								previousGather: this.state.previousGather,
								soundController: this.state.soundController }),
							eventsPanel,
							React.createElement("hr", null),
							React.createElement(_gather.ArchivedGathers, { archive: this.state.archive,
								maps: this.state.maps,
								servers: this.state.servers })
						)
					)
				)
			)
		);
	}
});

module.exports = SplashScreen;
});

require.register("javascripts/components/message", function(exports, require, module) {
"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var ReactEmoji = require("react-emoji");
var ReactAutolink = require("react-autolink");
var MessageBrowser = React.createClass({
	displayName: "MessageBrowser",
	getInitialState: function getInitialState() {
		return {
			browserState: "",
			messages: [],
			page: 0,
			limit: 250,
			search: ""
		};
	},
	handleNextPage: function handleNextPage(e) {
		e.preventDefault();
		var page = this.state.page;
		this.setState({ page: page + 1 });
		this.loadMessages();
	},
	handlePreviousPage: function handlePreviousPage(e) {
		e.preventDefault();
		var page = this.state.page;
		if (page < 1) return;
		this.setState({ page: page - 1 });
		this.loadMessages();
	},
	pageHandlers: function pageHandlers() {
		var previous = undefined;
		if (this.state.page > 0) {
			previous = React.createElement(
				"a",
				{ className: "btn btn-xs btn-primary add-right",
					onClick: this.handlePreviousPage },
				"Prev"
			);
		}
		var next = undefined;
		if (this.state.messages.length === this.state.limit) {
			next = React.createElement(
				"a",
				{ className: "btn btn-xs btn-primary",
					onClick: this.handleNextPage },
				"Next"
			);
		}
		return React.createElement(
			"div",
			null,
			previous,
			React.createElement(
				"span",
				{ className: "add-right" },
				this.state.page
			),
			next
		);
	},
	loadMessages: function loadMessages() {
		var _this = this;

		var limit = this.state.limit;
		var page = this.state.page;
		var data = {
			limit: limit,
			page: page
		};

		if (this.state.search.length) {
			data.query = this.state.search;
		}

		this.setState({ browserState: "Retrieving messages" });
		$.ajax({
			url: "/api/messages",
			data: data
		}).done(function (data) {
			_this.setState({
				messages: data.messages,
				browserState: ""
			});
		}).fail(function (error) {
			console.error(error);
			_this.setState({
				browserState: "Unable to retrieve messages."
			});
		});
	},
	componentDidMount: function componentDidMount() {
		this.loadMessages();
	},
	updateLimit: function updateLimit(e) {
		var newLimit = parseInt(e.target.value, 10);
		if (isNaN(newLimit) || newLimit > 250) newLimit = 250;
		this.setState({ limit: newLimit });
	},
	updateSearch: function updateSearch(e) {
		this.setState({ search: e.target.value });
	},
	render: function render() {
		var browserState = undefined;
		if (this.state.browserState.length) {
			browserState = React.createElement(
				"div",
				{ className: "col-xs-7" },
				React.createElement(
					"div",
					{ className: "well" },
					this.state.browserState
				)
			);
		}
		var messages = this.state.messages.map(function (message) {
			return React.createElement(
				"tr",
				{ key: message._id },
				React.createElement(
					"td",
					{ className: "col-xs-2" },
					new Date(message.createdAt).toString()
				),
				React.createElement(
					"td",
					{ className: "col-xs-3" },
					message.author.username
				),
				React.createElement(
					"td",
					{ className: "col-xs-5" },
					message.content
				),
				React.createElement(
					"td",
					{ className: "col-xs-2" },
					message._id
				)
			);
		});
		return React.createElement(
			"div",
			{ className: "row" },
			React.createElement(
				"div",
				{ className: "col-xs-5" },
				React.createElement(
					"div",
					{ className: "form-horizontal" },
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3 control-label" },
							"Max Results"
						),
						React.createElement(
							"div",
							{ className: "col-sm-9" },
							React.createElement("input", { type: "number", className: "form-control",
								onChange: this.updateLimit,
								value: this.state.limit })
						)
					),
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3 control-label" },
							"Search Filter"
						),
						React.createElement(
							"div",
							{ className: "col-sm-9" },
							React.createElement("input", { type: "text", className: "form-control",
								onChange: this.updateSearch,
								value: this.state.search })
						)
					),
					React.createElement(
						"div",
						{ className: "form-group" },
						React.createElement(
							"div",
							{ className: "col-sm-offset-3 col-sm-9" },
							React.createElement(
								"button",
								{
									className: "btn btn-primary",
									onClick: this.loadMessages },
								"Search"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-sm-offset-3 col-sm-9" },
							React.createElement(
								"p",
								null,
								"Page Control"
							),
							this.pageHandlers()
						)
					)
				)
			),
			browserState,
			React.createElement(
				"div",
				{ className: "col-xs-12" },
				React.createElement(
					"table",
					{ className: "table" },
					React.createElement(
						"thead",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement(
								"th",
								null,
								"Date"
							),
							React.createElement(
								"th",
								null,
								"Author"
							),
							React.createElement(
								"th",
								null,
								"Message"
							),
							React.createElement(
								"th",
								null,
								"ID"
							)
						)
					),
					React.createElement(
						"tbody",
						null,
						messages
					)
				)
			)
		);
	}
});

var Chatroom = exports.Chatroom = React.createClass({
	displayName: "Chatroom",

	propTypes: {
		messages: React.PropTypes.array.isRequired,
		socket: React.PropTypes.object.isRequired,
		user: React.PropTypes.object.isRequired
	},

	getInitialState: function getInitialState() {
		return {
			autoScroll: true
		};
	},
	componentDidMount: function componentDidMount() {
		var self = this;

		this.scrollListener = _.debounce(function (event) {
			self.temporarilyDisableAutoScroll(event);
		}, 300, {
			leading: false,
			trailing: true
		});

		var node = ReactDOM.findDOMNode(this.refs.messageContainer);
		node.addEventListener('scroll', this.scrollListener);

		this.scrollToBottom();
	},
	componentWillUnmount: function componentWillUnmount() {
		node.removeEventListener('scroll', this.scrollListener);
		clearTimeout(this.disableScrollTimer);
	},
	loadMoreMessages: function loadMoreMessages() {
		var earliestMessage = this.props.messages[0];
		if (earliestMessage === undefined) return;
		this.props.socket.emit("message:refresh", {
			before: earliestMessage.createdAt
		});
	},
	sendMessage: function sendMessage(message) {
		this.props.socket.emit("newMessage", { message: message });
	},
	clearAutoScrollTimeout: function clearAutoScrollTimeout() {
		if (this.disableScrollTimer) clearTimeout(this.disableScrollTimer);
	},
	temporarilyDisableAutoScroll: function temporarilyDisableAutoScroll(event) {
		var self = this;
		var node = event.target;
		if (node) {
			if (node.scrollHeight - node.scrollTop === node.clientHeight) {
				this.setState({ autoScroll: true });
				this.clearAutoScrollTimeout();
			}
			if (node.scrollHeight - node.scrollTop - node.clientHeight < 50) return;
		}
		this.setState({ autoScroll: false });
		this.clearAutoScrollTimeout();
		this.disableScrollTimer = setTimeout(function () {
			self.setState({
				autoScroll: true
			});
		}, 10000);
	},
	componentDidUpdate: function componentDidUpdate() {
		this.scrollToBottom();
	},
	scrollToBottom: function scrollToBottom() {
		if (!this.state.autoScroll) return;
		var node = ReactDOM.findDOMNode(this.refs.messageContainer);
		node.scrollTop = node.scrollHeight;
	},
	render: function render() {
		var _this2 = this;

		var socket = this.props.socket;
		var messages = this.props.messages.map(function (message) {
			if (message) {
				return React.createElement(ChatMessage, { message: message,
					key: message._id,
					socket: socket,
					user: _this2.props.user });
			}
		});
		return React.createElement(
			"div",
			{ className: "panel panel-primary chatbox" },
			React.createElement(
				"div",
				{ className: "panel-heading" },
				"Gather Chat"
			),
			React.createElement(
				"div",
				{ className: "panel-body" },
				React.createElement(
					"ul",
					{ className: "chat", id: "chatmessages", ref: "messageContainer" },
					React.createElement(
						"li",
						{ className: "text-center" },
						React.createElement(
							"a",
							{ href: "#",
								onClick: this.loadMoreMessages,
								className: "btn btn-primary btn-xs" },
							"Load more messages"
						)
					),
					messages
				)
			),
			React.createElement(
				"div",
				{ className: "panel-footer" },
				React.createElement(MessageBar, { socket: socket })
			)
		);
	}
});

var imgurRegex = /^(https?:\/\/i\.imgur\.com\/\S*\.(jpg|png))$/i;

var ChatMessage = React.createClass({
	displayName: "ChatMessage",

	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		message: React.PropTypes.object.isRequired
	},

	mixins: [ReactAutolink, ReactEmoji],

	getInitialState: function getInitialState() {
		return {
			createdAt: ""
		};
	},
	updateCreatedAt: function updateCreatedAt() {
		var self = this;
		if (this.props.message.createdAt) {
			self.setState({
				createdAt: $.timeago(self.props.message.createdAt)
			});
		}
	},
	componentWillMount: function componentWillMount() {
		this.updateCreatedAt();
	},
	componentDidMount: function componentDidMount() {
		this.interval = setInterval(this.updateCreatedAt, 60000);
	},

	componentWillUnmount: function componentWillUnmount() {
		clearInterval(this.interval);
	},

	messageContent: function messageContent() {
		var self = this;
		var message = self.props.message.content;
		if (message.match(imgurRegex)) {
			return React.createElement(
				"div",
				{ className: "imgur-container" },
				React.createElement(
					"a",
					{ href: message, target: "_blank" },
					React.createElement("img", { className: "imgur-chat", src: message })
				)
			);
		}

		return self.autolink(message, {
			target: "_blank",
			rel: "nofollow"
		}).map(function (elem) {
			if (_.isString(elem)) {
				return self.emojify(elem);
			} else {
				return elem;
			}
		});
	},

	render: function render() {
		var deleteButton = undefined;
		var user = this.props.user;
		if (user && user.admin) {
			deleteButton = React.createElement(DeleteMessageButton, { messageId: this.props.message._id,
				socket: this.props.socket });
		}
		return React.createElement(
			"li",
			{ className: "left clearfix" },
			React.createElement(
				"span",
				{ className: "chat-img pull-left" },
				React.createElement("img", {
					src: this.props.message.author.avatar,
					alt: "User Avatar",
					height: "40",
					width: "40",
					className: "img-circle" })
			),
			React.createElement(
				"div",
				{ className: "chat-body clearfix" },
				React.createElement(
					"div",
					{ className: "header" },
					React.createElement(
						"strong",
						{ className: "primary-font" },
						this.props.message.author.username
					),
					React.createElement(
						"small",
						{ className: "pull-right text-muted" },
						deleteButton,
						React.createElement(
							"span",
							{ className: "hidden-xs" },
							React.createElement("i", { className: "fa fa-clock-o fa-fw" }),
							this.state.createdAt
						)
					)
				),
				React.createElement(
					"p",
					{ className: "wordwrap" },
					this.messageContent()
				)
			)
		);
	}
});

var DeleteMessageButton = React.createClass({
	displayName: "DeleteMessageButton",

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	handleClick: function handleClick(e) {
		e.preventDefault();
		this.props.socket.emit("message:delete", {
			id: this.props.messageId
		});
	},
	render: function render() {
		return React.createElement(
			"a",
			{ href: "#", onClick: this.handleClick },
			React.createElement("i", { className: "fa fa-trash-o" })
		);
	}
});

var MessageBar = React.createClass({
	displayName: "MessageBar",

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	sendMessage: function sendMessage(content) {
		this.props.socket.emit("message:new", {
			content: content
		});
	},
	getInitialState: function getInitialState() {
		return {
			statusMessage: null
		};
	},
	checkInputLength: function checkInputLength() {
		var input = ReactDOM.findDOMNode(this.refs.content).value;
		var currentStatusMessage = this.state.statusMessage;
		if (input.length > 256) {
			return this.setState({
				statusMessage: "Maximum of 256 characters will be saved"
			});
		}
		if (currentStatusMessage !== null) {
			this.setState({
				statusMessage: null
			});
		}
	},
	handleInputChange: function handleInputChange() {
		// Noop, later assigned as debounced method in componentWillMount
	},
	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
		var content = ReactDOM.findDOMNode(this.refs.content).value.trim();
		if (!content) return;
		ReactDOM.findDOMNode(this.refs.content).value = '';
		this.sendMessage(content);
		return;
	},
	componentWillMount: function componentWillMount() {
		this.handleInputChange = _.debounce(this.checkInputLength, {
			leading: false,
			trailing: true
		});
	},
	render: function render() {
		var statusMessage = undefined;
		if (this.state.statusMessage !== null) {
			statusMessage = React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement(
					"small",
					null,
					this.state.statusMessage
				)
			);
		}
		return React.createElement(
			"form",
			{ onSubmit: this.handleSubmit, autoComplete: "off" },
			React.createElement(
				"div",
				{ className: "input-group" },
				React.createElement("input", {
					id: "btn-input",
					type: "text",
					className: "form-control",
					ref: "content",
					onChange: this.handleInputChange,
					autoComplete: "off",
					placeholder: "Be polite please..." }),
				React.createElement(
					"span",
					{ className: "input-group-btn" },
					React.createElement("input", {
						type: "submit",
						className: "btn btn-primary",
						id: "btn-chat",
						value: "Send" })
				)
			),
			statusMessage
		);
	}
});
});

require.register("javascripts/components/settings", function(exports, require, module) {
"use strict";

var React = require("react");

var SettingsPanel = exports.SettingsPanel = React.createClass({
	displayName: "SettingsPanel",

	propTypes: {
		toggleUpdateTitle: React.PropTypes.func.isRequired,
		updateTitle: React.PropTypes.bool.isRequired,
		toggleEventsPanel: React.PropTypes.func.isRequired,
		showEventsPanel: React.PropTypes.bool.isRequired
	},

	render: function render() {
		return React.createElement(
			"div",
			{ className: "modal fade", id: "settingsmodal" },
			React.createElement(
				"div",
				{ className: "modal-dialog" },
				React.createElement(
					"div",
					{ className: "modal-content" },
					React.createElement(
						"div",
						{ className: "modal-header" },
						React.createElement(
							"button",
							{ type: "button", className: "close", "data-dismiss": "modal",
								"aria-label": "Close" },
							React.createElement(
								"span",
								{ "aria-hidden": "true" },
								"×"
							)
						),
						React.createElement(
							"h4",
							{ className: "modal-title" },
							"Settings"
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body" },
						React.createElement(
							"div",
							{ className: "checkbox" },
							React.createElement(
								"label",
								{ className: "checkbox-inline" },
								React.createElement("input", { type: "checkbox",
									onChange: this.props.toggleUpdateTitle,
									checked: this.props.updateTitle }),
								" Update Gather Status in Title (Cabooble Mode) - May require refresh"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body" },
						React.createElement(
							"div",
							{ className: "checkbox" },
							React.createElement(
								"label",
								{ className: "checkbox-inline" },
								React.createElement("input", { type: "checkbox",
									onChange: this.props.toggleEventsPanel,
									checked: this.props.showEventsPanel }),
								" Show events panel"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "modal-footer" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-default",
								"data-dismiss": "modal" },
							"Close"
						)
					)
				)
			)
		);
	}
});
});

require.register("javascripts/components/snowMachine", function(exports, require, module) {
"use strict";

var React = require("react");

var SnowMachineMenu = React.createClass({
	displayName: "SnowMachineMenu",
	getInitialState: function getInitialState() {
		return {
			snowMachine: null
		};
	},
	componentDidMount: function componentDidMount() {
		var snowMachine = new SnowMachine();
		snowMachine.start();
		this.setState({ snowMachine: snowMachine });
	},
	toggle: function toggle() {
		var snowMachine = this.state.snowMachine;
		if (snowMachine.timer) {
			snowMachine.stop();
		} else {
			snowMachine.start();
		}
	},
	render: function render() {
		return React.createElement(
			"ul",
			{ className: "nav navbar-top-links navbar-right" },
			React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#", onClick: this.toggle },
					"Snow"
				)
			)
		);
	}
});
});

require.register("javascripts/components/sound", function(exports, require, module) {
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require("jquery");
var React = require("react");
var Howl = require("howler").Howl;
var Howler = require("howler").Howler;
var helper = require("javascripts/helper");
var storageAvailable = helper.storageAvailable;

var SoundController = function () {
	function SoundController() {
		var _this = this;

		_classCallCheck(this, SoundController);

		if (Howl === undefined) {
			throw new Error("Howl.js required to created sound controller");
		}

		this.MINIMUM_PLAY_INTERVAL = 20000;

		this.playGatherMusic = _.throttle(function () {
			_this.gather.music.play();
		}, this.MINIMUM_PLAY_INTERVAL);

		this.isMuted = Howler._muted;

		var gatherMusic = undefined;
		if (storageAvailable("localStorage")) {
			var volume = localStorage.getItem("gatherVolume");
			if (volume !== undefined) Howler.volume(volume);
			gatherMusic = localStorage.getItem("gatherMusic");
		}

		this.tunes = {
			"classic": {
				description: "Gathers Classic",
				url: 'http://www.ensl.org/files/audio/gather-1.mp3'
			},
			"nights": {
				description: "Nights",
				url: 'http://www.ensl.org/files/audio/nights.mp3'
			},
			"robby": {
				description: "Robby",
				url: 'http://www.ensl.org/files/audio/robby.mp3'
			},
			"america": {
				description: "Infamous",
				url: 'http://www.ensl.org/files/audio/america.mp3'
			},
			"prommah": {
				description: "Prommah",
				url: 'http://www.ensl.org/files/audio/prommah.mp3'
			},
			"turts": {
				description: "Gorges Rock your Ass",
				url: 'http://www.ensl.org/files/audio/turts.mp3'
			},
			"skyice": {
				description: "Skyice",
				url: 'http://www.ensl.org/files/audio/skyice.mp3'
			},
			"justwannahavefun": {
				description: "Gorges just want to have fun",
				url: 'http://www.ensl.org/files/audio/justwannahavefun.mp3'
			},
			"eyeofthegorgie": {
				description: "Eye of the Gorgie",
				url: 'http://www.ensl.org/files/audio/eyeofthegorgie.mp3'
			},
			"boondock": {
				description: "Boondock Marines",
				url: 'http://www.ensl.org/files/audio/boondock.mp3'
			},
			"preclassic": {
				description: "Old Gathers Classic",
				url: 'http://www.ensl.org/files/audio/gather-5.mp3'
			}
		};

		this.setupGatherMusic(gatherMusic);
	}

	_createClass(SoundController, [{
		key: "mute",
		value: function mute() {
			this.isMuted = true;
			return Howler.mute();
		}
	}, {
		key: "unMute",
		value: function unMute() {
			this.isMuted = false;
			return Howler.unmute();
		}
	}, {
		key: "getVolume",
		value: function getVolume() {
			return Howler.volume();
		}
	}, {
		key: "setVolume",
		value: function setVolume(val) {
			if (val === undefined || typeof val !== 'number' || Math.abs(val) > 1) return;
			if (storageAvailable("localStorage")) {
				localStorage.setItem("gatherVolume", val);
			}
			return Howler.volume(val);
		}
	}, {
		key: "play",
		value: function play(music) {
			if (this.gather && this.gather.music) return this.gather.music.play();
		}
	}, {
		key: "stop",
		value: function stop(music) {
			if (this.gather && this.gather.music) return this.gather.music.stop();
		}
	}, {
		key: "defaultGatherMusic",
		value: function defaultGatherMusic() {
			return "classic";
		}
	}, {
		key: "setupGatherMusic",
		value: function setupGatherMusic(musicName) {
			var self = this;
			var gatherMusic = self.tunes[musicName];

			if (!gatherMusic) {
				musicName = this.defaultGatherMusic();
				gatherMusic = self.tunes[musicName];
			}

			if (self.gather && self.gather.name === musicName) return;

			// Stop if already playing
			if (self.gather && self.gather.music) {
				self.gather.music.stop();
			}

			var tune = self.tunes[musicName];
			self.gather = {
				name: musicName,
				description: tune.description,
				url: tune.url,
				music: new Howl({
					urls: [tune.url]
				})
			};
		}
	}]);

	return SoundController;
}();

var MusicSelector = React.createClass({
	displayName: "MusicSelector",
	getInitialState: function getInitialState() {
		return {
			music: this.selectedMusic()
		};
	},
	selectedMusic: function selectedMusic() {
		if (storageAvailable("localStorage")) {
			return localStorage.getItem("gatherMusic") || this.props.soundController.defaultGatherMusic();
		} else {
			return this.props.soundController.defaultGatherMusic();
		}
	},
	setMusic: function setMusic(event) {
		var name = event.target.value;
		var soundController = this.props.soundController;
		var selectedTune = soundController.tunes[name];
		if (selectedTune === undefined) return;
		this.setState({ music: name });
		soundController.setupGatherMusic(name);
		if (storageAvailable("localStorage")) {
			localStorage.setItem("gatherMusic", name);
		}
	},
	render: function render() {
		var soundController = this.props.soundController;
		var tunes = [];
		for (var attr in soundController.tunes) {
			var o = soundController.tunes[attr];
			o.id = attr;
			tunes.push(o);
		}
		var options = tunes.map(function (tune) {
			return React.createElement(
				"option",
				{ key: tune.id, value: tune.id },
				tune.description
			);
		});
		return React.createElement(
			"div",
			{ className: "form-group music-select" },
			React.createElement(
				"label",
				null,
				"Music"
			),
			React.createElement(
				"select",
				{
					className: "form-control",
					defaultValue: this.state.music,
					onChange: this.setMusic,
					value: this.state.music },
				options
			)
		);
	}
});

var SoundPanel = React.createClass({
	displayName: "SoundPanel",
	componentDidMount: function componentDidMount() {
		var soundController = this.props.soundController;
		var scale = 10;

		$('a#sound-dropdown').on('click', function (event) {
			$(this).parent().toggleClass('open');
		});

		$("#volume-slide").slider({
			min: 0,
			max: scale,
			step: 1
		}).on("slideStop", function (_ref) {
			var value = _ref.value;

			soundController.setVolume(value / scale);
		}).slider('setValue', soundController.getVolume() * scale);
	},
	mute: function mute() {
		this.props.soundController.mute();
		this.forceUpdate();
	},
	unMute: function unMute() {
		this.props.soundController.unMute();
		this.forceUpdate();
	},
	play: function play() {
		this.props.soundController.play();
	},
	stop: function stop() {
		this.props.soundController.stop();
	},
	render: function render() {
		var soundController = this.props.soundController;
		var mutedIcon = undefined,
		    mutedButton = undefined;
		if (soundController.isMuted) {
			mutedIcon = React.createElement("i", { className: "fa fa-volume-off fa-fw" });
			mutedButton = React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#", onClick: this.unMute },
					mutedIcon,
					" Muted"
				)
			);
		} else {
			mutedIcon = React.createElement("i", { className: "fa fa-volume-up fa-fw" });
			mutedButton = React.createElement(
				"li",
				null,
				React.createElement(
					"a",
					{ href: "#", onClick: this.mute },
					mutedIcon,
					" Unmuted"
				)
			);
		}
		return React.createElement(
			"ul",
			{ className: "nav navbar-top-links navbar-right" },
			React.createElement(
				"li",
				{ className: "dropdown" },
				React.createElement(
					"a",
					{ className: "dropdown-toggle", href: "#", id: "sound-dropdown" },
					"Sound  ",
					mutedIcon,
					" ",
					React.createElement("i", { className: "fa fa-caret-down" })
				),
				React.createElement(
					"ul",
					{ className: "dropdown-menu", id: "sound-dropdown" },
					mutedButton,
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#", onClick: this.play },
							React.createElement("i", { className: "fa fa-play" }),
							" Play"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#", onClick: this.stop },
							React.createElement("i", { className: "fa fa-stop" }),
							" Stop"
						)
					),
					React.createElement("hr", null),
					React.createElement(
						"li",
						null,
						React.createElement(
							"div",
							{ className: "volume-slide" },
							React.createElement(
								"label",
								null,
								"Volume"
							),
							React.createElement("div", { id: "volume-slide" })
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(MusicSelector, { soundController: soundController })
					)
				)
			)
		);
	}
});

module.exports = {
	SoundController: SoundController,
	SoundPanel: SoundPanel
};
});

require.register("javascripts/components/teamspeak", function(exports, require, module) {
"use strict";

var React = require("react");

var teamspeakDefaults = {
	url: "ts3server://ensl.org/",
	password: "ns2gather",
	alien: {
		channel: "NS2 Gather/Gather #1/Alien",
		password: "ns2gather"
	},
	marine: {
		channel: "NS2 Gather/Gather #1/Marine",
		password: "ns2gather"
	}
};

var TeamSpeakButton = exports.TeamSpeakButton = React.createClass({
	displayName: "TeamSpeakButton",
	getDefaultProps: function getDefaultProps() {
		return teamspeakDefaults;
	},
	marineUrl: function marineUrl() {
		return this.teamSpeakUrl(this.props.marine);
	},
	alienUrl: function alienUrl() {
		return this.teamSpeakUrl(this.props.alien);
	},
	teamSpeakUrl: function teamSpeakUrl(conn) {
		var params = "channel=" + encodeURIComponent(conn.channel) + "&\n\t\t\tchannelpassword=" + encodeURIComponent(conn.password);
		return this.props.url + "?" + params;
	},
	render: function render() {
		return React.createElement(
			"ul",
			{ className: "nav navbar-top-links navbar-right" },
			React.createElement(
				"li",
				{ className: "dropdown" },
				React.createElement(
					"a",
					{ className: "dropdown-toggle", "data-toggle": "dropdown", href: "#" },
					"Teamspeak  ",
					React.createElement("i", { className: "fa fa-caret-down" })
				),
				React.createElement(
					"ul",
					{ className: "dropdown-menu" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: this.props.url },
							"Join Teamspeak Lobby"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: this.marineUrl() },
							"Join Marine Teamspeak"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: this.alienUrl() },
							"Join Alien Teamspeak"
						)
					),
					React.createElement("li", { role: "separator", className: "divider" }),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ href: "#", "data-toggle": "modal", "data-target": "#teamspeakmodal" },
							"Teamspeak Details"
						)
					)
				)
			)
		);
	}
});

var TeamSpeakModal = exports.TeamSpeakModal = React.createClass({
	displayName: "TeamSpeakModal",
	getDefaultProps: function getDefaultProps() {
		return teamspeakDefaults;
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "modal fade text-left", id: "teamspeakmodal" },
			React.createElement(
				"div",
				{ className: "modal-dialog" },
				React.createElement(
					"div",
					{ className: "modal-content" },
					React.createElement(
						"div",
						{ className: "modal-header" },
						React.createElement(
							"button",
							{ type: "button",
								className: "close",
								"data-dismiss": "modal",
								"aria-label": "Close" },
							React.createElement(
								"span",
								{ "aria-hidden": "true" },
								"×"
							)
						),
						React.createElement(
							"h4",
							{ className: "modal-title" },
							"Teamspeak Server Information"
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body" },
						React.createElement(
							"dl",
							{ className: "dl-horizontal" },
							React.createElement(
								"dt",
								null,
								"Server"
							),
							React.createElement(
								"dd",
								null,
								this.props.url
							),
							React.createElement(
								"dt",
								null,
								"Password"
							),
							React.createElement(
								"dd",
								null,
								this.props.password
							),
							React.createElement(
								"dt",
								null,
								"Marine Channel"
							),
							React.createElement(
								"dd",
								null,
								this.props.marine.channel
							),
							React.createElement(
								"dt",
								null,
								"Alien Channel"
							),
							React.createElement(
								"dd",
								null,
								this.props.alien.channel
							)
						)
					)
				)
			)
		);
	}
});
});

require.register("javascripts/components/user", function(exports, require, module) {
"use strict";

var _gather = require("javascripts/components/gather");

var React = require("react");
var helper = require("javascripts/helper");
var enslUrl = helper.enslUrl;
var hiveUrl = helper.hiveUrl;
var modalId = helper.modalId;

var UserLogin = React.createClass({
	displayName: "UserLogin",

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	authorizeId: function authorizeId(id) {
		this.props.socket.emit("users:authorize", {
			id: parseInt(id, 10)
		});
	},
	handleSubmit: function handleSubmit(e) {
		e.preventDefault();
		var id = React.findDOMNode(this.refs.authorize_id).value.trim();
		if (!id) return;
		React.findDOMNode(this.refs.authorize_id).value = '';
		this.authorizeId(id);
	},
	render: function render() {
		return React.createElement(
			"form",
			{ onSubmit: this.handleSubmit },
			React.createElement(
				"div",
				{ className: "input-group signin" },
				React.createElement("input", {
					id: "btn-input",
					type: "text",
					className: "form-control",
					ref: "authorize_id",
					placeholder: "Change user" }),
				React.createElement(
					"span",
					{ className: "input-group-btn" },
					React.createElement("input", {
						type: "submit",
						className: "btn btn-primary",
						id: "btn-chat",
						value: "Assume ID" })
				)
			)
		);
	}
});

var DisconnectUserButton = React.createClass({
	displayName: "DisconnectUserButton",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		id: React.PropTypes.number.isRequired
	},

	getDefaultProps: function getDefaultProps() {
		return {
			id: null
		};
	},
	disconnectUser: function disconnectUser() {
		this.props.socket.emit("users:disconnect", {
			id: this.props.id
		});
	},
	render: function render() {
		return React.createElement(
			"button",
			{
				className: "btn btn-danger",
				onClick: this.disconnectUser },
			"Disconnect User"
		);
	}
});

var UserModal = React.createClass({
	displayName: "UserModal",

	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired
	},

	render: function render() {
		var currentUser = this.props.currentUser;
		var user = this.props.user;
		var hiveStats = undefined;
		if (user.hive.id) {
			hiveStats = [React.createElement(
				"tr",
				{ key: "stats" },
				React.createElement(
					"td",
					null,
					React.createElement(
						"strong",
						null,
						"Hive Stats"
					)
				),
				React.createElement("td", null)
			), React.createElement(
				"tr",
				{ key: "elo" },
				React.createElement(
					"td",
					null,
					"ELO"
				),
				React.createElement(
					"td",
					null,
					user.hive.skill
				)
			), React.createElement(
				"tr",
				{ key: "hours" },
				React.createElement(
					"td",
					null,
					"Hours Played"
				),
				React.createElement(
					"td",
					null,
					Math.round(user.hive.playTime / 3600)
				)
			), React.createElement(
				"tr",
				{ key: "wins" },
				React.createElement(
					"td",
					null,
					"Wins"
				),
				React.createElement(
					"td",
					null,
					user.hive.wins
				)
			), React.createElement(
				"tr",
				{ key: "losses" },
				React.createElement(
					"td",
					null,
					"Losses"
				),
				React.createElement(
					"td",
					null,
					user.hive.loses
				)
			), React.createElement(
				"tr",
				{ key: "kills" },
				React.createElement(
					"td",
					null,
					"Kills (/min)"
				),
				React.createElement(
					"td",
					null,
					user.hive.kills,
					" (",
					_.round(user.hive.kills / (user.hive.playTime / 60), 1),
					")"
				)
			), React.createElement(
				"tr",
				{ key: "assists" },
				React.createElement(
					"td",
					null,
					"Assists (/min)"
				),
				React.createElement(
					"td",
					null,
					user.hive.assists,
					" (",
					_.round(user.hive.assists / (user.hive.playTime / 60), 1),
					")"
				)
			), React.createElement(
				"tr",
				{ key: "deaths" },
				React.createElement(
					"td",
					null,
					"Deaths (/min)"
				),
				React.createElement(
					"td",
					null,
					user.hive.deaths,
					" (",
					_.round(user.hive.deaths / (user.hive.playTime / 60), 1),
					")"
				)
			)];
		}
		var adminOptions = undefined;
		if (currentUser.admin) {
			adminOptions = React.createElement(DisconnectUserButton, { id: user.id, socket: this.props.socket });
		}
		return React.createElement(
			"div",
			{ className: "modal fade", id: modalId(user) },
			React.createElement(
				"div",
				{ className: "modal-dialog" },
				React.createElement(
					"div",
					{ className: "modal-content" },
					React.createElement(
						"div",
						{ className: "modal-header" },
						React.createElement(
							"button",
							{ type: "button", className: "close", "data-dismiss": "modal",
								"aria-label": "Close" },
							React.createElement(
								"span",
								{ "aria-hidden": "true" },
								"×"
							)
						),
						React.createElement(
							"h4",
							{ className: "modal-title" },
							React.createElement("img", { src: "blank.gif",
								className: "flag flag-" + (user.country === null ? "eu" : user.country.toLowerCase()),
								alt: user.country }),
							" ",
							user.username
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body" },
						React.createElement(
							"div",
							{ className: "text-center" },
							React.createElement("img", {
								src: user.avatar,
								alt: "User Avatar" })
						),
						React.createElement(
							"table",
							{ className: "table" },
							React.createElement(
								"tbody",
								null,
								React.createElement(
									"tr",
									null,
									React.createElement(
										"td",
										null,
										"Lifeforms"
									),
									React.createElement(
										"td",
										null,
										React.createElement(_gather.LifeformIcons, { gatherer: { user: user } })
									)
								),
								React.createElement(
									"tr",
									null,
									React.createElement(
										"td",
										null,
										"Links"
									),
									React.createElement(
										"td",
										null,
										React.createElement(
											"a",
											{ href: enslUrl(user),
												className: "btn btn-xs btn-primary",
												target: "_blank" },
											"ENSL Profile"
										),
										" ",
										React.createElement(
											"a",
											{ href: hiveUrl({ user: user }),
												className: "btn btn-xs btn-primary",
												target: "_blank" },
											"Hive Profile"
										)
									)
								),
								hiveStats
							)
						)
					),
					React.createElement(
						"div",
						{ className: "modal-footer" },
						adminOptions,
						React.createElement(
							"button",
							{ type: "button",
								className: "btn btn-default",
								"data-dismiss": "modal" },
							"Close"
						)
					)
				)
			)
		);
	}
});

var UserItem = React.createClass({
	displayName: "UserItem",

	propTypes: {
		user: React.PropTypes.object.isRequired,
		socket: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired
	},

	render: function render() {
		var user = this.props.user;
		var currentUser = this.props.currentUser;
		return React.createElement(
			"li",
			{ className: "list-group-item" },
			React.createElement(
				"a",
				{ href: "#", "data-toggle": "modal",
					"data-target": "#" + modalId(user) },
				user.username
			),
			React.createElement(UserModal, { user: user, currentUser: currentUser,
				socket: this.props.socket })
		);
	}
});

var UserMenu = exports.UserMenu = React.createClass({
	displayName: "UserMenu",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		users: React.PropTypes.array.isRequired
	},

	render: function render() {
		var _this = this;

		var users = this.props.users.sort(function (a, b) {
			return a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1;
		}).map(function (user) {
			return React.createElement(UserItem, { user: user, key: user.id,
				currentUser: _this.props.user, socket: _this.props.socket });
		});
		return React.createElement(
			"div",
			null,
			React.createElement(
				"div",
				{ className: "panel panel-primary add-bottom" },
				React.createElement(
					"div",
					{ className: "panel-heading" },
					React.createElement("i", { className: "fa fa-users fa-fw" }),
					"  Online",
					React.createElement(
						"span",
						{ className: "badge pull-right" },
						this.props.users.length
					)
				),
				React.createElement(
					"ul",
					{ className: "list-group", id: "users-list" },
					users
				)
			)
		);
	}
});

var AdminPanel = exports.AdminPanel = React.createClass({
	displayName: "AdminPanel",

	propTypes: {
		socket: React.PropTypes.object.isRequired
	},

	handleGatherReset: function handleGatherReset() {
		this.props.socket.emit("gather:reset");
	},
	render: function render() {
		return React.createElement(
			"div",
			{ className: "modal fade", id: "adminmodal" },
			React.createElement(
				"div",
				{ className: "modal-dialog" },
				React.createElement(
					"div",
					{ className: "modal-content" },
					React.createElement(
						"div",
						{ className: "modal-header" },
						React.createElement(
							"button",
							{ type: "button", className: "close", "data-dismiss": "modal",
								"aria-label": "Close" },
							React.createElement(
								"span",
								{ "aria-hidden": "true" },
								"×"
							)
						),
						React.createElement(
							"h4",
							{ className: "modal-title" },
							"Administration Panel"
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body", id: "admin-menu" },
						React.createElement(
							"h5",
							null,
							"Swap Into a Different Account (Only works for admins)"
						),
						React.createElement(UserLogin, { socket: this.props.socket }),
						React.createElement(
							"h5",
							null,
							"Gather Options"
						),
						React.createElement(
							"div",
							null,
							React.createElement(
								"button",
								{
									className: "btn btn-danger max-width",
									onClick: this.handleGatherReset },
								"Reset Gather"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "modal-footer" },
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-default",
								"data-dismiss": "modal" },
							"Close"
						)
					)
				)
			)
		);
	}
});

var ProfileModal = exports.ProfileModal = React.createClass({
	displayName: "ProfileModal",

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	handleUserUpdate: function handleUserUpdate(e) {
		e.preventDefault();
		var abilities = {
			skulk: React.findDOMNode(this.refs.skulk).checked,
			lerk: React.findDOMNode(this.refs.lerk).checked,
			gorge: React.findDOMNode(this.refs.gorge).checked,
			fade: React.findDOMNode(this.refs.fade).checked,
			onos: React.findDOMNode(this.refs.onos).checked,
			commander: React.findDOMNode(this.refs.commander).checked
		};
		var skill = React.findDOMNode(this.refs.playerskill).value;
		socket.emit("users:update:profile", {
			id: this.props.user.id,
			profile: {
				abilities: abilities,
				skill: skill
			}
		});
	},
	render: function render() {
		if (!this.props.user) return false;
		var abilities = this.props.user.profile.abilities;
		var abilitiesForm = [];
		for (var lifeform in abilities) {
			abilitiesForm.push(React.createElement(
				"div",
				{ key: lifeform, className: "checkbox" },
				React.createElement(
					"label",
					{ className: "checkbox-inline" },
					React.createElement("input", { type: "checkbox",
						ref: lifeform,
						defaultChecked: abilities[lifeform] }),
					" ",
					_.capitalize(lifeform)
				)
			));
		}

		var skillLevel = this.props.user.profile.skill;
		var skillLevels = _.uniq(["Low Skill", "Medium Skill", "High Skill", skillLevel]).filter(function (skill) {
			return typeof skill === 'string';
		}).map(function (skill) {
			return React.createElement(
				"option",
				{ key: skill },
				skill
			);
		});

		return React.createElement(
			"div",
			{ className: "modal fade", id: "profilemodal" },
			React.createElement(
				"div",
				{ className: "modal-dialog" },
				React.createElement(
					"div",
					{ className: "modal-content" },
					React.createElement(
						"div",
						{ className: "modal-header" },
						React.createElement(
							"button",
							{ type: "button", className: "close", "data-dismiss": "modal",
								"aria-label": "Close" },
							React.createElement(
								"span",
								{ "aria-hidden": "true" },
								"×"
							)
						),
						React.createElement(
							"h4",
							{ className: "modal-title" },
							"Profile"
						)
					),
					React.createElement(
						"div",
						{ className: "modal-body", id: "profile-panel" },
						React.createElement(
							"form",
							null,
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									null,
									"Player Skill"
								),
								React.createElement("br", null),
								React.createElement(
									"select",
									{
										defaultValue: skillLevel,
										className: "form-control",
										ref: "playerskill" },
									skillLevels
								),
								React.createElement(
									"p",
									{ className: "add-top" },
									React.createElement(
										"small",
										null,
										"Try to give an accurate representation of your skill to raise the quality of your gathers"
									)
								)
							),
							React.createElement("hr", null),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									null,
									"Preferred Lifeforms"
								),
								React.createElement("br", null),
								abilitiesForm,
								React.createElement(
									"p",
									null,
									React.createElement(
										"small",
										null,
										"Specify which lifeforms you'd like to play in the gather"
									)
								)
							),
							React.createElement("hr", null),
							React.createElement(
								"p",
								{ className: "small" },
								"You will need to rejoin the gather to see your updated profile"
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"button",
									{
										type: "submit",
										className: "btn btn-primary",
										"data-dismiss": "modal",
										onClick: this.handleUserUpdate },
									"Update & Close"
								)
							)
						)
					)
				)
			)
		);
	}
});

var CurrentUser = exports.CurrentUser = React.createClass({
	displayName: "CurrentUser",
	render: function render() {
		if (this.props.user) {
			var adminOptions = undefined;
			if (this.props.user.admin || this.props.user.moderator) {
				adminOptions = React.createElement(
					"li",
					null,
					React.createElement(
						"a",
						{ href: "#", "data-toggle": "modal", "data-target": "#adminmodal" },
						React.createElement("i", { className: "fa fa-magic fa-fw" }),
						" Administration"
					)
				);
			}
			return React.createElement(
				"li",
				{ className: "dropdown" },
				React.createElement(
					"a",
					{ className: "dropdown-toggle", "data-toggle": "dropdown", href: "#" },
					this.props.user.username,
					"  ",
					React.createElement("img", { src: this.props.user.avatar,
						alt: "User Avatar",
						height: "20",
						width: "20" }),
					" ",
					React.createElement("i", { className: "fa fa-caret-down" })
				),
				React.createElement(
					"ul",
					{ className: "dropdown-menu dropdown-user" },
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ "data-toggle": "modal",
								"data-target": "#profilemodal",
								href: "#" },
							React.createElement("i", { className: "fa fa-user fa-fw" }),
							" Profile"
						)
					),
					React.createElement(
						"li",
						null,
						React.createElement(
							"a",
							{ "data-toggle": "modal",
								"data-target": "#settingsmodal",
								href: "#" },
							React.createElement("i", { className: "fa fa-gear fa-fw" }),
							" Settings"
						)
					),
					adminOptions
				)
			);
		} else {
			return false;
		}
	}
});

var AssumeUserIdButton = exports.AssumeUserIdButton = React.createClass({
	displayName: "AssumeUserIdButton",

	propTypes: {
		socket: React.PropTypes.object.isRequired,
		gatherer: React.PropTypes.object.isRequired,
		currentUser: React.PropTypes.object.isRequired
	},

	assumeId: function assumeId(e) {
		var _this2 = this;

		e.preventDefault();
		if (this.props.gatherer) {
			this.props.socket.emit("users:authorize", {
				id: this.props.gatherer.id
			});
			// Refresh Gather list
			setTimeout(function () {
				_this2.props.socket.emit("gather:refresh");
			}, 5000);
		}
	},
	render: function render() {
		var currentUser = this.props.currentUser;
		var gatherer = this.props.gatherer;
		if (currentUser && gatherer) {
			return React.createElement(
				"button",
				{
					className: "btn btn-xs btn-danger",
					onClick: this.assumeId },
				"Assume User ID"
			);
		}
	}
});
});

require.register("javascripts/helper", function(exports, require, module) {
'use strict';

// Accepts an array of IDs voted
// 1. Creates an array of tally objects,
//		with ID as prop and vote count as val { 12: 0 }
// 2. Increments ID vote tally for every vote
// 3. Sorts

var rankVotes = exports.rankVotes = function (votes, candidates) {
	var initial = candidates.reduce(function (acc, candidate) {
		acc[candidate.id] = 0;
		return acc;
	}, {});

	var scores = votes.reduce(function (acc, id) {
		if (acc[id] !== undefined) {
			acc[id]++;
		}
		return acc;
	}, initial);

	var rank = [];

	for (var id in scores) {
		if (scores.hasOwnProperty(id)) {
			rank.push({
				id: parseInt(id, 10),
				count: scores[id]
			});
		}
	}

	return rank.sort(function (a, b) {
		if (b.count === a.count) {
			return b.id - a.id;
		} else {
			return b.count - a.count;
		}
	}).map(function (tally) {
		return tally.id;
	}).map(function (id) {
		return candidates.reduce(function (acc, candidate) {
			if (candidate.id === id) return candidate;
			return acc;
		});
	});
};

var enslUrl = exports.enslUrl = function (gatherer) {
	return 'http://www.ensl.org/users/' + gatherer.id;
};

var hiveUrl = exports.hiveUrl = function (gatherer) {
	var hiveId = gatherer.user.hive.id;
	if (hiveId) {
		return 'http://hive.naturalselection2.com/profile/' + hiveId;
	} else {
		return null;
	}
};

var modalId = exports.modalId = function (user) {
	return 'user-modal-' + user.id;
};

var storageAvailable = exports.storageAvailable = function (type) {
	try {
		var storage = window[type],
		    x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return false;
	}
};
});


//# sourceMappingURL=app.js.map