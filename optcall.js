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
		Delegate option-callback procedures.
	@end-module-documentation

	@include:
		{
			"ate": "ate",
			"async": "async",
			"called": "called",
			"empt": "empt",
			"harden": "harden",
			"glucose": "glucose",
			"Olivant": "olivant",
			"optfor": "optfor",
			"snapd": "snapd"
		}
	@end-include
*/

if( typeof window == "undefined" ){
	var ate = require( "ate" );
	var called = require( "called" );
	var empt = require( "empt" );
	var harden = require( "harden" );
	var glucose = require( "glucose" );
	var Olivant = require( "olivant" );
	var optfor = require( "optfor" );
	var snapd = require( "snapd" );
	var series = require( "async" ).series;
}

if( typeof window != "undefined" &&
	!( "ate" in window ) )
{
	throw new Error( "ate is not defined" );
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
	!( "Olivant" in window ) )
{
	throw new Error( "Olivant is not defined" );
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
harden( "OPTCALL_WRAPPED", "optcall-wrapped" );

var optcall = function optcall( engine, context ){
	/*;
		@meta-configuration:
			{
				"engine:required": [
					"object",
					"function"
				],
				"context": "object"
			}
		@end-meta-configuration
	*/

	engine = optfor( arguments, FUNCTION ) || engine;

	if( typeof engine == OBJECT ){
		if( engine.OPTCALL_WRAPPED == OPTCALL_WRAPPED ){
			return engine;

		}else{
			ate( "OPTCALL_WRAPPED", OPTCALL_WRAPPED, engine );
		}
	}

	context = context || optfor( arguments, OBJECT );

	if( typeof engine == FUNCTION ){
		optcall( engine.prototype, context );

		return engine;
	}

	if( !context ){
		return engine;
	}

	if( typeof engine == OBJECT && typeof engine.parent == FUNCTION ){
		context = context || engine;

		optcall( engine.parent.prototype, context );
	}

	if( typeof engine == OBJECT &&
		typeof engine.constructor == FUNCTION &&
		typeof engine.constructor.prototype == OBJECT )
	{
		optcall( engine.constructor.prototype, context );
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
			let property = method.name;

			context[ property ] = optcall.wrap( method );
		} );

	snapd( function clear( ){
		delete engine.OPTCALL_WRAPPED;
	} );

	return engine;
};

harden.bind( optcall )
	( "transfer", function transfer( option, choice ) {
		if( typeof choice == UNDEFINED ||
			choice === null ||
			empt( choice ) )
		{
			Warning( "cannot transfer option", choice, option )
				.remind( "option to be transferred is empty" )
				.silence( )
				.prompt( );

			return optcall;
		}

		for( let property in choice ){
			option[ property ] = choice[ property ];
		}

		if( typeof option.mix == FUNCTION ){
			option.mix( choice );

		}else{
			Warning( "cannot mix cache", option, choice )
				.prompt( );
		}

		return optcall;
	} );

harden.bind( optcall )
	( "wrap", function wrap( method ){
		let property = method.name;

		if( method.OPTCALL_DELEGATED === OPTCALL_DELEGATED ){
			return method;
		}

		let delegate = function delegate( option, callback ){
			option = option || { };

			let self = option.self || this;

			/*;
				@note:
					This should be clear, the option given by individual method
						can override the instance option.
				@end-note
			*/
			option = optfor( arguments, OBJECT ) || { };
			self.option = self.option || option;
			self.option = glucose.bind( self )( self.option );

			optcall.transfer( self.option, option );

			callback = optfor( arguments, FUNCTION );
			callback = called.bind( self )( callback );

			if( self.chainMode === true ){
				if( self.chainTimeout ){
					clearTimeout( self.chainTimeout );

					delete self.chainTimeout;
				}

				if( !( "callStack" in self ) ){
					harden( "callStack", [ ], self );
				}

				self.callStack.push( {
					"self": self,
					"method": method,
					"callback": callback
				} );

				self.chainTimeout = snapd.bind( self )
					( function chain( ){
						let resultList = [ ];

						let callback = called.bind( this )( );

						series( this.callStack
							.map( ( function onEachCall( call ){
								callback = call.callback;

								return ( function delegate( tellback ){
									let done = called.bind( this )
										( function( issue, result, option ){
											clearTimeout( call.timeout );
											delete call.timeout;

											option.result = result;

											resultList.push( result );

											optcall.transfer( this.option, option );

											if( call.callback ){
												call.callback( issue, result, this.option );
											}

											if( issue ){
												tellback( issue );

											}else{
												tellback( );
											}
										} );

									call.timeout = snapd.bind( this )
										( function fallback( ){
											Issue( "failed to call callback", call.method )
												.remind( "possible delay of execution" )
												.prompt( "fallback due to callback failure",
													this.option )
												.report( )
												.pass( done );
										}, 1000 * 5 ).timeout;

									call.method.bind( this )( this.option, done );
								} ).bind( this );
							} ).bind( this ) ),

							( function lastly( issue ){
								if( callback ){
									callback( issue, resultList.pop( ), this.option );

								}else if( typeof this.emit == FUNCTION ){
									this.emit( "done", issue, resultList.pop( ), this.option );
								}

								while( this.callStack.length ){
									let call = this.callStack.pop( );

									if( typeof call.timeout != UNDEFINED ){
										clearTimeout( call.timeout );

										delete call.timeout;
									}
								}

								delete this.chainTimeout;
								delete this.chainMode;

								if( this.clearTimeout ){
									clearTimeout( this.clearTimeout );

									delete this.clearTimeout;
								}

								this.clearTimeout = snapd.bind( this )
									( function clear( ){
										this.option.clear( );

										Record( "option cache cleared", this.option.cache );
									}, 1000 * 1 ).timeout;
							} ).bind( this ) );
					} ).timeout;

			}else{
				if( self.clearTimeout ){
					clearTimeout( self.clearTimeout );

					delete self.clearTimeout;
				}

				self.clearTimeout = snapd.bind( self )
					( function clear( ){
						this.option.clear( );

						Record( "option cache cleared", this.option.cache );
					}, 1000 * 1 ).timeout;

				return method.bind( self )
					( self.option, called.bind( self )
						( function onResult( issue, result, option ){
							option.result = result;

							optcall.transfer( this.option, option );

							callback( issue, result, this.option );
						} ) );
			}

			return self;
		};

		harden( "OPTCALL_DELEGATED", OPTCALL_DELEGATED, delegate );

		harden( "method", method, delegate );

		ate( "name", property, delegate );

		return delegate;
	} );

harden.bind( optcall )
	( "FUNCTION_PATTERN",
		/^function\s+([a-z_$][a-zA-Z0-9_$]+)?\s*\(\s*option\s*\,\s*callback\s*\)/ );

module.exports = optcall;
