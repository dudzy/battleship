var alphabet = 'ABCDEFGHIJ';
var sessions = [];

function createCells( target ) {
	for ( var i = 0; i < alphabet.length; i++ ) {
		var currentColumn = alphabet[i];
		for ( var j = 1; j <= 10; j++ ) {
			target[currentColumn + "x" + j] = 0;
		}
	}
}
function initFields( currentState ) {
	createCells( currentState.Self );
	createCells( currentState.Enemy );
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

exports.createNewGameSession = function () {
	return createNewGameSession( );
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
exports.getCurrentPlayer = function ( index ) {
	return sessions[index].currentPlayer;
}
exports.changeCurrentPlayer = function ( index ) {
	var current = sessions[index].currentPlayer;
	sessions[index].currentPlayer = current == 1 ? 0 : 1;
}