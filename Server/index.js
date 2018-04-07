var WebSocket = require('ws');

var wss = new WebSocket.Server({ port: 3000 });
console.log("Server running on port 3000.")

/*wss.broadcast = function broadcast(data) {
	console.log(data);
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};*/

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(data) {
		console.log("Data: " + data);
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	});
});