"use strict";

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
	React.render(<CurrentUser />, document.getElementById('currentuser'));
};