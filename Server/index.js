/*
	
			Server Codde		Client Code		Errors
	Host 	0x10				0x01 			1: Invalid session name. 2: Session name already in use.
	Join 	0x20 				0x02 			1: Invalid session name. 2: Session doesn't exist.
	Update 	0x30 				0x03 			1: Client not hosting session. 2: Illegal message format. 3: Illegal movement code.
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
	}
	if(command == 0x02){
		handleJoin(socket, len, data.substring(6));
	}
	if(command == 0x03){
		handleUpdate(socket, len, data.substring(6));
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
	sendSuccess(socket, "\x20");
	console.log("Client joined: " + name);
}

var MOVE = 0x01;
var ROTATE = 0x02;
var SCALE = 0x03;

function handleUpdate(socket, len, data){
	if(!(socket in hosts)){
		logErr("handleUpdate", "Client not hosting session.");
		sendFailure(socket, "\x30", "\x01");
		return;
	}
	if(len != 25){
		logErr("handleUpdate", "Illegal message format.");
		sendFailure(socket, "\x30", "\x02");
		return;
	}
	var type = data.charCodeAt(0);
	if(!(type == MOVE || type == ROTATE || type == SCALE)){
		logErr("handleUpdate", "Illegal movement code.");
		sendFailure(socket, "\x30", "\x03");
		return;
	}

	var message = "\x01\x00\x00\x00\x19\x30" + data;
	var id;
	for (id in sessions[hosts[socket]]){
		if(clients[id].readyState === WebSocket.OPEN) {
			clients[id].send(message);
		}
	}
	console.log("Session \"" + sessions[hosts[socket]] + "\" updated.");
}

var FAILURE = 0x00;
var SUCCESS = 0x01;

function sendSuccess(socket, code){
	socket.send("\x01\x00\x00\x00\x01" + code + SUCCESS);
}

function sendFailure(socket, code, errCode){
	socket.send("\x01\x00\x00\x00\x02" + code + FAILURE + errCode);
}

function endSession(sessionName){
	var id;
	for(id in sessions[sessionName]){
		clients[id].close();
	}
	delete sessions[sessionName];
}