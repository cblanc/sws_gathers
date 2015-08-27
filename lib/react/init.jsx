"use strict";

var socket;

var initialiseVisibilityMonitoring = (socket) => {
	let hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
	  hidden = "hidden";
	  visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	  hidden = "mozHidden";
	  visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	  hidden = "msHidden";
	  visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	  hidden = "webkitHidden";
	  visibilityChange = "webkitvisibilitychange";
	}

	document.addEventListener(visibilityChange, () => {
		if (document[hidden]) {
			socket.emit("users:away");
		} else {
			socket.emit("users:online");
		}
	}, false);
}

var removeAuthWidget = () => {
	$("#authenticating").remove();
};

var showAuthenticationNotice = () => {
	$("#auth-required").show();
};

var showGatherBanNotice = () => {
	$("#gather-banned").show();
};

var renderPage = (socket) => {
	initialiseVisibilityMonitoring(socket);
	React.render(<UserMenu />, document.getElementById('side-menu'));
	React.render(<Chatroom />, document.getElementById('chatroom'));
	React.render(<Gather />, document.getElementById('gathers'));
	React.render(<CurrentUser />, document.getElementById('currentuser'));
	React.render(<AdminPanel />, document.getElementById('admin-menu'));
};

var initialiseComponents = () => {
	let socketUrl = window.location.protocol + "//" + window.location.host;
	socket = io(socketUrl)
		.on("connect", () => {
			console.log("Connected");
			removeAuthWidget();
			renderPage(socket);
			socket.on("reconnect", () => {
					socket.emit("message:refresh");
					socket.emit("gather:refresh");
					socket.emit("users:refresh");
					console.log("Reconnected");
				})
				.on("disconnect", () => {
					console.log("Disconnected")
				});
		})
		.on("error", (error, foo) => {
			console.log(error);
			if (error === "Authentication Failed") {
				removeAuthWidget();
				showAuthenticationNotice();
			} else if (error === "Gather Banned") {
				removeAuthWidget();
				showGatherBanNotice();
			}
		})
};
