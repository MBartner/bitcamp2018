document.write("hello2");
var socket = new WebSocket('ws://127.0.0.1:3000');
var isConnected = false;

// When the connection is open, send some data to the server
socket.onopen = function () {
	isConnected = true;
	socket.send("Awake");
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

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

setInterval(function(){ socket.send(document.getElementById("tb").value); }, 3000);