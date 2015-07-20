"use strict";

module.exports = function (io) {
	var root = io.of("/");
	var authorised = io.of("/authorised");

	var emitCount = function () {
		root.emit('gatherCount', {
			count: root.sockets.length
		});		
	};

	var onConnection = function (socket) {
		emitCount();
	};

	var onDisconnect = function (socket) {
		emitCount();
	};

	io.on('connection', function (socket) {

		onConnection(socket);
	  
	  socket.on('disconnect', function (socket) {
	    onDisconnect();
	  });
	});
};

// socket.on('my other event', function (data) {
//   console.log(data);
// });