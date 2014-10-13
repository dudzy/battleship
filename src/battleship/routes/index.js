//Index
exports.index = function ( req, res ) {
	var test = require( '../logic/gameLogic' );
	if (test.test2() != 5) test.test( 5 );


	res.render( 'index', { title: test.test2( ) } );
};