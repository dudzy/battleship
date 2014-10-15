exports.createGame = function ( token, commandContext ) {
	var session = require( "./gameSession" );
	var socket = require( "./gameSocket" );
	
	var index = session.createNewGameSession( token );
	
	function getInItialCellObject( count ) {
		return { ship : { count : count , sourceSize: count } , isProcessed: false };
	}

	function addToHorizontal( count, startColumn, startRow ) {
		if ( count > 4 || count < 1 ) throw 'out of range';
		
		for ( var i = 0; i < count; i++ ) {
			session.setCellValue( index, , startRow , true );
		}
	}
	
	function addToVertical( count, startColumn, startRow ) {
		if ( count > 4 || count < 1 ) throw 'out of range';
		
		var obj = getInItialCellObject(count);
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
							addToVertical( ship.count , ship.column , ship.row );
						} else {
							addToHorizontal( ship.count , ship.column , ship.row );
						}
					} catch ( x ) {
						eventSource.socket.json.send( { event: 'createField', state: 'collision ships error' } );
						return;
					}
					
				}
				break;
			case "move":
				var currentPlayer = session.getCurrentPlayer( index );
				var socketPlayer = getSocketPlayer( eventSource.roomClients );
				if ( socketPlayer != currentPlayer ) return;
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
			case "whomove":
				var currentPlayer = session.getCurrentPlayer( index );
				var socketPlayer = getSocketPlayer( eventSource.roomClients );
				
				eventSource.socket.json.send( { event: 'whomove', isYouTurn: currentPlayer == socketPlayer } );
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