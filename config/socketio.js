"use strict";

module.exports = function (io) {
	io.on('connection', function (socket) {
	  socket.emit('welcome', { hello: 'world' });
	  // socket.on('my other event', function (data) {
	  //   console.log(data);
	  // });
	  socket.on('disconnect', function () {
	    io.emit('user disconnected');
	  });
	});
};