"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "optcall",
			"path": "optcall/optcall.js",
			"file": "optcall.js",
			"module": "optcall",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/optcall.git",
			"test": "optcall-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:

	@end-module-documentation

	@include:
		{
			"async": "async",
			"called": "called",
			"harden": "harden",
			"glucose": "glucose",
			"optfor": "optfor",
			"snapd": "snapd"
		}
	@end-include
*/

if( typeof window == "undefined" ){
	var called = require( "called" );
	var harden = require( "harden" );
	var glucose = require( "glucose" );
	var optfor = require( "optfor" );
	var snapd = require( "snapd" );
	var series = require( "async" ).series;
}

if( typeof window != "undefined" &&
	!( "called" in window ) )
{
	throw new Error( "called is not defined" );
}

if( typeof window != "undefined" &&
	!( "harden" in window ) )
{
	throw new Error( "harden is not defined" );
}

if( typeof window != "undefined" &&
	!( "glucose" in window ) )
{
	throw new Error( "glucose is not defined" );
}

if( typeof window != "undefined" &&
	!( "optfor" in window ) )
{
	throw new Error( "optfor is not defined" );
}

if( typeof window != "undefined" &&
	!( "snapd" in window ) )
{
	throw new Error( "snapd is not defined" );
}

if( typeof window != "undefined" &&
	!( "async" in window ) )
{
	throw new Error( "async is not defined" );

}else if( typeof window != "undefined" &&
	"async" in window )
{
	var series = window.async.series;
}

harden( "OPTCALL_DELEGATED", "optcall-delegate" );

var optcall = function optcall( engine ){
	/*;
		@meta-configuration:
			{
				"engine:required": [
					"object",
					"function"
				]
			}
		@end-meta-configuration
	*/

	engine = optfor( arguments, FUNCTION ) || engine;
	if( typeof engine == FUNCTION &&
		typeof engine.prototype.parent == FUNCTION )
	{
		return optcall( engine.prototype.parent );

	}else if( typeof engine == FUNCTION &&
		engine.prototype )
	{
		return optcall( engine.prototype );

	}else if( typeof engine == OBJECT &&
		typeof engine.parent == FUNCTION )
	{
		optcall( engine.parent );
	}

	Object.getOwnPropertyNames( engine )
		.filter( function onEachProperty( property ){
			return ( typeof engine[ property ] == "function" );
		} )
		.map( function onEachProperty( property ){
			return engine[ property ];
		} )
		.filter( function onEachMethod( method ){
			return optcall.FUNCTION_PATTERN.test( method.toString( ) );
		} )
		.forEach( function onEachMethod( method ){
			var property = method.name;

			engine[ property ] = optcall.wrap( method );
		} );

	return engine;
};

harden.bind( optcall )
	( "wrap", function wrap( method ){
		var property = method.name;

		if( method.OPTCALL_DELEGATED === OPTCALL_DELEGATED ){
			return method;
		}

		var delegate = function delegate( option, callback ){
			option = optfor( arguments, OBJECT );
			option = glucose.bind( this )( option || this.option );

			callback = optfor( arguments, FUNCTION );
			if( callback ){
				callback = called.bind( this )( callback );
			}

			if( arguments.length == 2 &&
				typeof arguments[ 0 ] == OBJECT &&
				typeof arguments[ 1 ] == FUNCTION )
			{
				method.bind( this )( option, callback );

			}else{
				if( this.chainTimeout ){
					clearTimeout( this.chainTimeout );

					delete this.chainTimeout;
				}

				this.callStack = this.callStack || [ ];

				this.callStack.push( method );

				this.chainTimeout = snapd.bind( this )
					( function chain( ){
						var resultList = [ ];

						series( this.callStack
							.map( ( function onEachMethod( method ){
								return ( function( _callback ){
									method.bind( this )
										( option, called.bind( this )
											( function( issue, result, option ){
												resultList.push( result );

												if( callback ){
													callback( issue, result, option );
												}

												if( issue ){
													_callback( issue );

												}else{
													_callback( );
												}
											} ) );
								} ).bind( this );
							} ).bind( this ) ),

							( function lastly( issue ){
								if( callback ){
									callback( issue, resultList.pop( ), option );

								}else if( typeof this.emit == FUNCTION ){
									this.emit( "done", issue, resultList.pop( ), option );
								}

								this.callStack = [ ];

								delete this.chainTimeout;
							} ).bind( this ) );
					} ).timeout;
			}

			return this;
		};

		harden( "OPTCALL_DELEGATED", OPTCALL_DELEGATED, delegate );
		harden( "name", property, delegate );

		return delegate;
	} );

harden.bind( optcall )
	( "FUNCTION_PATTERN",
		/^function\s+([a-zA-Z_$][a-zA-Z0-9_$]+)?\s*\(\s*option\s*\,\s*callback\s*\)/ );

module.exports = optcall;
