
//create game session
exports.createGame = function ( token, commandContext ) {
	var session = require( './gameSession' );
	var socket = require( './gameSocket' );
	
	var index = session.createNewGameSession( token );
	
	function getInItialCellObject( count ) {
		return { ship : { count : count , sourceSize: count } , isProcessed: false };
	}
	
	function addToHorizontal( index , count, startColumn, startRow ) {
		if ( count > 4 || count < 1 ) throw "out of range";
		
		var alphabet = 'ABCDEFGHIJ';
		for ( var i = 0; i < count; i++ ) {
			session.setCellValue( index, alphabet[i] , startRow , true );
		}
	}
	
	function addToVertical( index , count, startColumn, startRow ) {
		if ( count > 4 || count < 1 ) throw 'out of range';
		
		var obj = getInItialCellObject( count );
		for ( var i = startRow; i < count; i++ ) {
			session.setCellValue( index, startColumn , i , obj , true );
		}
	}
	
	function getSocketPlayer( clients ) {
		var iterator = 0;
		for ( var client in clients ) {
			if ( eventSource.socket.id == clients[client].id ) break;
			iterator++;
		}
	}
	
	socket.createSocket(
	function ( eventSource ) {
		var command = eventSource.command;
		switch ( command.event ) {
			case "createField":
				if ( command.ships.length != 10 ) {
					eventSource.socket.json.send( { event: 'createField', state: 'count ships error' } );
					return;
				}
				for ( var ship in command.ships ) {
					try {
						if ( ship.isVertical ) {
							addToVertical( eventSource.sessionId, ship.count , ship.column , ship.row );
						} else {
							addToHorizontal( eventSource.sessionId, ship.count , ship.column , ship.row );
						}
					} catch ( x ) {
						eventSource.socket.json.send( { event: 'createField', state: 'collision ships error' } );
						return;
					}
				}
				break;
			case "move":
				var currentPlayer = session.getCurrentPlayer( eventSource.sessionId );
				var socketPlayer = getSocketPlayer( eventSource.roomClients );
				if ( socketPlayer != currentPlayer ) return;
				var content = session.getEnemyCellValue( eventSource.sessionId , command.column, command.row );
				if ( content.isProcessed ) return;
				
				var action = 'empty';
				if ( content.ship != null ) {
					if ( content.ship.count == 0 ) {
						action = 'error';
					} else {
						action = --content.ship.count == 0 ? 'dead' : 'hit';
					}
				}
				session.changeCurrentPlayer( eventSource.sessionId );
				for ( var roomClient in eventSource.roomClients ) {
					roomClient.json.send( { event: 'move', action : action , column : command.column , row: command.row } );
				}
				break;
			case "chat":
				for ( var roomClient in eventSource.roomClients ) {
					roomClient.json.send( { event: 'chat', message : command.message } );
				}
				break;
			case "whomove":
				var currentPlayer = session.getCurrentPlayer( eventSource.sessionId );
				var socketPlayer = getSocketPlayer( eventSource.roomClients );
				
				eventSource.socket.json.send( { event: 'whomove', isYouTurn: currentPlayer == socketPlayer } );
				break;
			default: throw 'Incorrect command';
		}
	},
	function ( eventSource ) {
		return session.roomExists( eventSource.room );
	},
	function ( eventSource ) {
		//error
	},
	function ( eventSource ) {
		//if there was one client in room that destroy the room
		if ( eventSource.roomClients.length == 1 ) {
			eventSource.roomClients[0].json.send( { event: "notopponent" } );
			eventSource.roomClients[0].disconnect( );
		}
	}
 );
	
	return index;
	
}