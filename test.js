"use strict";

const diatom = require( "diatom" );
const optcall = require( "./optcall.js" );

const Computation = diatom( "Computation" );

Computation.prototype.initialize = function initialize( option, callback ){

    this.chainMode = true;

    return this;

};


Computation.prototype.compute = function compute( option, callback ) {

    console.log( "compute" );

    callback( null, null, {} );

    return this;

};

Computation.prototype.applySomeThing = function applySomeThing( option, callback ) {

    console.log( "apply something", option );

    callback( null, null, option );

    return this;

};

Computation.prototype.done = function done( option, callback ) {

    console.log( "done" );

    return this;

};

optcall( Computation );


Computation( )
    .compute( function onCompute( issue, result, option ){
        option.set( "hello", "world" );
    } )
    .applySomeThing( function onApplySomething( issue, result, option ){
        console.log( option.get( "hello" ) );
    } )
    .done( function onDone() {
        console.log( "complete" )
    } );
