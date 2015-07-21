"use strict";

module.exports = function (io) {
	var root = io.of("/");
	var authorised = io.of("/authorised");

	// Authorisation
	root.use(function (socket, next) {
		socket._user = {
			id: 1,
			username: "Chris (" + socket.id.slice(0,5) + ")",
			steamId: "11111111",
			email: "cablanchard@gmail.com",
			bans: []
		};
		next();
	});

	var refreshGatherers = function (socket) {
		var receiver = (socket !== undefined) ? socket : root;
		
		receiver.emit('gatherCount', {
			count: root.sockets.length,
			gatherers: root.sockets.map(function (socket) {
				return socket._user
			})
		});		
	};

	io.on('connection', function (socket) {
		refreshGatherers();
	  
		socket.on('refreshGathers', refreshGatherers.bind(null, socket));

	  socket.on('disconnect', function (socket) {
	    refreshGatherers();
	  });
	});
};

// socket.on('my other event', function (data) {
//   console.log(data);
// });