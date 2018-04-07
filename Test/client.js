var socket = new WebSocket('ws://127.0.0.1:3000');
var isConnected = false;

// When the connection is open, send some data to the server
socket.onopen = function () {
	isConnected = true;
  socket.send("\x01\x00\x00\x00\x06\x01\x05Hello");
  setTimeout(function() {
    socket.send("\x01\x00\x00\x00\x19\x03\x01" + "\x00\x00\x00\x00\x00\x00\x00\x04" + "\x00\x00\x00\x00\x00\x04\x00\x00" +"\x00\x00\x00\x00\x40\x00\x00\x00");
  }, 3000);
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

