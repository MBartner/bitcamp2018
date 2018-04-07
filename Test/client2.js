var socket = new WebSocket('ws://127.0.0.1:3000');
var isConnected = false;

// When the connection is open, send some data to the server
socket.onopen = function () {
	isConnected = true;
  socket.send("\x01\x00\x00\x00\x06\x02\x05Hello");
};

// Log errors
socket.onerror = function (error) {
	console.log('WebSocket Error ' + error);
};

// Log messages from the server
socket.onmessage = function (e) {
	document.write(e.data);
	console.log(e.data);
};

