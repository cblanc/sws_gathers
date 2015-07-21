var socket = io("http://localhost:8000/");

socket.on("connect", function () {
	console.log("Connected!");
});

// socket.on("reconnect", function () {

// });

// socket.on("disconnect", function () {

// });
