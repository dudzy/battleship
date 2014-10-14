exports.createGame = function ( token, commandContext ) {
	var session = require( "./gameSession" );
	var socket = require( "./gameSocket" );
	
	var index = session.createNewGameSession( token );
	socket.createSocket(
	function ( eventSource ) {
		var command = eventSource.command;
		switch ( command.event ) {
			case "createField"://TODO:create user game field
				//command.fields
				break;
			case "move":
				var currentPlayer = session.getCurrentPlayer( index );
				var iterator = 0;
				for ( var client in eventSource.roomClients ) {
					if ( eventSource.socket.id == eventSource.roomClients[client].id ) break;
					iterator++;
				}
				if ( iterator != currentPlayer ) return;
				var content = session.getEnemyCellValue( index, command.column, command.row );
				if ( content.isProcessed ) return;
				
				var action = 'empty';
				if ( content.ship != null ) {
					if ( content.ship.count == 0 ) {
						action = 'error';
					} else {
						action = --content.ship.count == 0 ? 'dead' : 'hit';
					}
				}
				session.changeCurrentPlayer( index );
				for ( var roomClient in eventSource.roomClients ) {
					roomClient.json.send( { event: 'move', action : action , column : command.column , row: command.row } );
				}
				break;
			case "chat":
				for ( var roomClient in eventSource.roomClients ) {
					roomClient.json.send( { event: 'chat', message : command.message } );
				}
				break;
			default: throw 'Incorrect command';
		}
	},
	function ( eventSource ) {
		return eventSource.room == index;
	},
	function ( eventSource ) {
	},
	function ( eventSource ) {
			//close
	}
 );
	
}