/*
	
			Server Codde		Client Code		Errors
	Host 	0x10				0x01 			1: Invalid session name. 2: Session name already in use.
	Join 	0x20 				0x02 			1: Invalid session name. 2: Session doesn't exist.
	Update 	0x30 				0x03 			1: Client not hosting session. 2: Illegal movement code.
	Leave 	0x40 				0x04 			1: Invalid name length
*/

var WebSocket = require('ws');

var wss = new WebSocket.Server({ port: 3000 });
console.log("Server running on port 3000.");

var hosts = {};
var sessions = {};
var id = 0;
var clients = {};

wss.on('connection', function connection(ws) {
	ws.id = id++;
	clients[ws.id] = ws;
	console.log("New connection.");
	ws.on('message', function incoming(data) {
		processData(ws, data);
	});
});

function logErr(functionName, err){
	console.error(functionName + "(): Error- " + err);
}

function processData(socket, data){
	if(data.length < 6){
		logErr("processData", "Invalid length message.");
		return;
	}
	if(data.charCodeAt(0) != 0x01){
		logErr("processData", "Invalid version ID.");
		return;
	}

	var len = (data.charCodeAt(1) << 24) + (data.charCodeAt(2) << 16) +  (data.charCodeAt(3) << 8) + data.charCodeAt(4);
	if(len != data.substring(6).length){
		logErr("processData", "Invalid length.");
		return;
	}
	var command = data.charCodeAt(5);

	if(command == 0x01){
		handleHost(socket, len, data.substring(6));
		console.log("handleHost()");
	}
	else if(command == 0x02){
		handleJoin(socket, len, data.substring(6));
		console.log("handleJoin()");
	}
	else if(command == 0x03){
		handleUpdate(socket, len, data.substring(6));
		console.log("handleUpdate()");
	}
	else if(command == 0x04){
		handleLeave(socket, len, data.substring(6));
		console.log("handleLeave()");
	}
	else{
		logErr("processData", "Invalid command.");
	}
}

function handleHost(socket, len, data){
	var nameLen = data.charCodeAt(0);
	if(nameLen === 0 || nameLen + 1 > len){
		logErr("handleHost", "Invalid name length.");
		sendFailure(socket, "\x10", "\x01");
		return;
	}
	var name = data.substring(1, 1 + nameLen);
	if(name in sessions){
		logErr("handleHost", "Session \"" + name + "\" already exists");
		sendFailure(socket, "\x10", "\x02");
		return;
	}
	if(socket in hosts){
		endSession(hosts[socket]);
	}
	hosts[socket] = name;
	sessions[name] = [];
	sendSuccess(socket, "\x10");
	console.log("Created new sesssion: " + name);
}

function handleJoin(socket, len, data){
	var nameLen = data.charCodeAt(0);
	if(nameLen === 0 || nameLen + 1 > len){
		logErr("handleJoin", "Invalid name length.");
		sendFailure(socket, "\x20", "\x01");
		return;
	}
	var name = data.substring(1, 1 + nameLen);
	if(!(name in sessions)){
		logErr("handleJoin", "Session doesn't exist.");
		sendFailure(socket, "\x20", "\x02");
		return;
	}

	sessions[name].push(socket.id);
	console.log("pushed id: " + socket.id);
	sendSuccess(socket, "\x20");
	console.log("Client " + socket.id + " joined: " + name);
}

var MOVE = 0x00;
var ROTATE = 0x01;
var SCALE = 0x02;

function handleUpdate(socket, len, data){
	if(!(socket in hosts)){
		logErr("handleUpdate", "Client not hosting session.");
		sendFailure(socket, "\x30", "\x01");
		return;
	}
	var type = data.charCodeAt(0);
	if(!(type == MOVE || type == ROTATE || type == SCALE)){
		logErr("handleUpdate", "Illegal movement code.");
		sendFailure(socket, "\x30", "\x02");
		return;
	}

	var message = "\x01" + intToByteString(len) + "\x30" + data;
	var key;
	console.log("IDs in session:");
	for(key in sessions[hosts[socket]]){
		console.log(id);
		if(clients[sessions[hosts[socket]][key]].readyState === WebSocket.OPEN) {
			clients[sessions[hosts[socket]][key]].send(message);
		}
	}
	console.log("Session \"" + hosts[socket] + "\" updated.");
}

function intToByteString(n){
	return String.fromCharCode((n >> 24) & 0xFF) + String.fromCharCode((n >> 16) & 0xFF) + String.fromCharCode((n >> 8) & 0xFF) + String.fromCharCode(n & 0xFF);
}

function handleLeave(socket, len, data){
	var nameLen = data.charCodeAt(0);
	if(nameLen === 0 || nameLen + 1 > len){
		logErr("handleLeave", "Invalid name length.");
		sendFailure(socket, "\x40", "\x01");
		return;
	}
	var name = data.substring(1, 1 + nameLen);
	if(!(name in sessions)){
		logErr("handleLeave", "Session doesn't exist.");
		sendFailure(socket, "\x40", "\x02");
		return;
	}
	if(!(socket.id in sessions[name])){
		logErr("handleLeave", "Client not in session.");
		sendFailure(socket, "\x40", "\x03");
		return;
	}

	for(var i = sessions[name].length - 1; i >= 0; i--){
		if(socket.id == sessions[name[i]]){
			sessions[name].splice(i, 1);
		}
	}
	sendSuccess(socket, "\x40");
	console.log("Client " + socket.id + " left " + name);
}

var FAILURE = 0x00;
var SUCCESS = 0x01;

function sendSuccess(socket, code){
	socket.send("\x01\x00\x00\x00\x01" + code + String.fromCharCode(SUCCESS));
}

function sendFailure(socket, code, errCode){
	socket.send("\x01\x00\x00\x00\x02" + code + String.fromCharCode(FAILURE) + errCode);
}

function endSession(sessionName){
	var id;
	for(id in sessions[sessionName]){
		clients[id].close();
	}
	delete sessions[sessionName];
}