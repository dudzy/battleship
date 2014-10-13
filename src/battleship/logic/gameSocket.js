var clients = {};

function getTime() {
	var time = ( new Date() ).toLocaleTimeString();
}
function getClientsInRoom(context,room){
	var result = [];
	for ( var connectedClient in context.sockets ) {
		var connectedClient = clients[""+connectedClient.id];
		if (!connectedClient) continue;
		
		if (connectedClient.room == clientInfo.room) result.push(connectedClient);
	}
	return result;
}

exports.createSocket = function (receiveCallback,introduceCallback,errorCallback,closeCallback) {
	var io = require( 'socket.io' ).listen( 8080 ); 

	// disable full log level
	io.set( 'log level', 1 );

	//client connection handler
	io.sockets.on(
		'connection',
		function ( socket ) {
			var clientId = "" + socket.id;
			clients[clientId] = { presented: false, name:"" , room: -1 };
			var currentClient = clients[clientId];

			// Send client what he need signup
			socket.json.send( { 'event': 'needIntroduce', 'time': getTime() } );

			//message handler
			socket.on( 
				'message', 
				function ( msg ) {
					var command = JSON.parse(msg);
					switch (command.event){
						case "introduce":
							if (currentClient.presented || !introduceCallback({ name: command.name , room: command.room })) return;
							currentClient.name = command.name;
							currentClient.room = command.room;
							currentClient.presented = true;
							socket.json.send( { 'event': 'introduceComplete', 'time': getTime() } );
							break;
						default:
							receiveCallback({ context: io, command: command,socket:socket,roomClients:getClientsInRoom(io,currentClient.room)});
							break;
					}
				}
			);
			//disconnect handler
			socket.on( 
				'disconnect',
				function () {
					var clientInfo = clients[clientId];
					delete clients[clientId];
					if ( clientInfo.presented && clientInfo.room != -1 ) {
						var roomClients = getClientsInRoom(io,clientInfo.room);
						for ( var roomClient in roomClients ) {
							connectedClient.json.send( { 'event': 'clientDisconnect', 'name': clientInfo.name, 'time': getTime( ) } );
						}
						closeCallback( { context:io,clientInfo:clientInfo,roomClients:roomClients } );
					}
				}
			);
		}
	);
}