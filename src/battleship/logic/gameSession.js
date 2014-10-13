var alphabet = 'ABCDEFGHIJ';
var sessions = [];

function createCells(target) {
	for (var i = 0; i < alphabet.length; i++) {
		var currentColumn = alphabet[i];
		for (var j = 1; j <= 10; j++) {
			target[currentColumn + "x" + j] = 0;
		}
	}
}
function initFields(currentState) {
	createCells(currentState.Self);
	createCells(currentState.Enemy);
}
function createNewGameSession(token) {
	if (sessions.length > 20) throw 'Sessions limit!';

	var currentState = { sessionToken: token, First: {}, Second: {} , currentPlayer: 0 };
	initFields(currentState);

	sessions.push(currentState);

	return sessions.length-1;
}
function getCellName(column,row){
	return "" + column + "x" + row;
}

exports.createNewGameSession = function (){
	return createNewGameSession();
}
exports.clearCells = function (index) {
	var session = sessions[index];
	createCells(session.Self);
	createCells(session.Enemy);
}

exports.setFirstCellValue = function (index, column, row, value) {
	sessions[index].First[getCellName(column,row)] = value;
}
exports.setSecondCellValue = function (index, column, row, value) {
	sessions[index].Second[getCellName(column, row)] = value;
}
exports.getFirstCellValue = function (index, column, row) {
	return sessions[index].First[getCellName(column, row)];
}
exports.getSecondCellValue = function (index, column, row) {
	return sessions[index].Second[getCellName(column, row)];
}
