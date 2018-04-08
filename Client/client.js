var WAITING = 0;
var JOINED = 1;
var HOSTING = 2;


var state = 0;

function callbackHost(num){
	console.log("callback returned: " + num);
	setInterval(function(){
		console.log("Send update: " + sendUpdate(1, 3, 4, 5));
	}, 5000);
}

function callbackConnected(){
	console.log("connected");
	host("hello", callbackHost);
}

connect(callbackConnected);
