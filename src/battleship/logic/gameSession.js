var alphabet = 'ABCDEFGHIJ';
var sessions = [];

function createCells( target ) {
	for ( var i = 0; i < alphabet.length; i++ ) {
		var currentColumn = alphabet[i];
		for ( var j = 1; j <= 10; j++ ) {
			target[currentColumn + "x" + j] = null;
		}
	}
}
function initFields( currentState ) {
	createCells( currentState.First );
	createCells( currentState.Second );
}
function createNewGameSession( token ) {
	if ( sessions.length > 20 ) throw 'Sessions limit!';
	
	var currentState = { sessionToken: token, First: {}, Second: {} , currentPlayer: 0 };
	initFields( currentState );
	
	sessions.push( currentState );
	
	return sessions.length - 1;
}
function getCellName( column, row ) {
	return "" + column + "x" + row;
}

exports.createNewGameSession = function ( token ) {
	return createNewGameSession( token );
}
exports.clearCells = function ( index ) {
	var session = sessions[index];
	createCells( session.Self );
	createCells( session.Enemy );
}
exports.getCellValue = function ( index, column, row ) {
	if ( sessions[index].currentPlayer == 0 ) {
		return sessions[index].First[getCellName( column, row )];
	} else {
		return sessions[index].Second[getCellName( column, row )];
	}
}
exports.getEnemyCellValue = function ( index, column, row ) {
	if ( sessions[index].currentPlayer == 0 ) {
		return sessions[index].Second[getCellName( column, row )];
	} else {
		return sessions[index].First[getCellName( column, row )];
		
	}
}
exports.setCellValue = function ( index, column, row , value , throwIfNull ) {
	var collection = sessions[index].currentPlayer == 0 ? sessions[index].First : sessions[index].Second;
	var cellName = getCellName( column, row );
	if ( throwIfNull && collection[cellName] == null ) throw 'cell is not null!';
	collection[cellName] = value;
}
exports.setEnemyCellValue = function ( index, column, row , value ) {
	var collection = sessions[index].currentPlayer == 0 ? sessions[index].Second : sessions[index].First;
	collection[getCellName( column, row )] = value;
}
exports.getCurrentPlayer = function ( index ) {
	return sessions[index].currentPlayer;
}
exports.changeCurrentPlayer = function ( index ) {
	var current = sessions[index].currentPlayer;
	sessions[index].currentPlayer = current == 1 ? 0 : 1;
}
exports.roomExists = function ( index ) {
	if ( index <= sessions.length ) return true;
	return sessions[index] != null;
}