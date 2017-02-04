"use strict";

const diatom = require( "diatom" );
const optcall = require( "./optcall.js" );

const Computation = diatom( "Computation" );

Computation.prototype.initialize = function initialize( option, callback ){

	callback( null, null, option );

    return this;

};


Computation.prototype.compute = function compute( option, callback ) {
	console.log( "compute", option );

    callback( null, null, option );

    return this;

};

Computation.prototype.applySomeThing = function applySomeThing( option, callback ) {

    console.log( "apply something", option );

    callback( null, null, option );

    return this;

};

Computation.prototype.done = function done( option, callback ) {

    console.log( "done" );

	callback( null, null, option );

    return this;

};

optcall( Computation );


Computation( { "yeah": "ugh" } )
	.chain( )
    .compute( function onCompute( issue, result, option ){
		option.set( "hello", "world" );
    } )
    .applySomeThing( function onApplySomething( issue, result, option ){
        console.log( "hello-world?", option.get( "hello" ) );
    } )
    .done( function onDone( issue, result, option ) {
        console.log( "complete", option );
    } );
