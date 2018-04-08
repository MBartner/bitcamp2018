

function callbackJoin(num){
	console.log("callbackJoin returned: " + num);
}

function callbackUpdate(type, x, y, z){
	console.log("callbackUpdate: type:" + type + ", x: " + x + ", y: " + y + ", z: " + z);
}

function callbackConnected(){
	console.log("connected");
	join("hello", callbackJoin, callbackUpdate);
}

connect(callbackConnected);
