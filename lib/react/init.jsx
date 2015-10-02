"use strict";

var socket, soundController;

var removeAuthWidget = () => $("#authenticating").remove();

var showAuthenticationNotice = () => $("#auth-required").show();

var showGatherBanNotice = () => $("#gather-banned").show();

var initialiseComponents = () => {
	let socketUrl = window.location.protocol + "//" + window.location.host;
	socket = io(socketUrl)
		.on("connect", () => {
			console.log("Connected");
			removeAuthWidget();
			soundController = new SoundController();
			React.render(<App socket={socket} soundController={soundController}/>, 
				document.getElementById("body_content"));
			socket.on("reconnect", () => {
					console.log("Reconnected");
					socket.emit("message:refresh");
					socket.emit("gather:refresh");
					socket.emit("users:refresh");
				})
				.on("disconnect", () => {
					console.log("Disconnected")
				});
		})
		.on("error", error => {
			console.log(error);
			if (error === "Authentication Failed") {
				removeAuthWidget();
				showAuthenticationNotice();
			} else if (error === "Gather Banned") {
				removeAuthWidget();
				showGatherBanNotice();
			}
		});
};
