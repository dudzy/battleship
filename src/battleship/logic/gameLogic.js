exports.createGame = function (token,commandContext) {
	var session = require( "./gameSession" );
	var socket = require( "./gameSocket" );

	var index = session.createNewGameSession( token );
	socket.createSocket(
		function (eventSource) {
			var command = eventSource.command;
			switch (command.event){
				case "createField"://TODO:create user game field
					//command.fields
					break;
				case "move":
					//command.coordinates
					
					break;
				case "chat":
					for (var roomClient in eventSource.roomClients){
						roomClient.json.send( { event: 'chat', message : command.message } );
					}
					break;
				default: throw 'Incorrect command';
			}
		},
		function (eventSource) {
			return eventSource.room == index;
		},
		function (eventSource) {
		},
		function (eventSource) {
			//close
		}
	);
	
}