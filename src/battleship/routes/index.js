//Index
exports.index = function ( req, res ) {
	//var test = require( '../logic/gameLogic' );
	//if (test.test2() != 5) test.test( 5 );
	var gameLogic = require( '../logic/gameLogic' );
	gameLogic.createGame( "fsdfsd", {} );

	res.render( 'index', { title: "" } );
};