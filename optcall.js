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
			"falzy": "falzy",
			"harden": "harden",
			"glucose": "glucose",
			"proplist": "proplist",
			"protease": "protease",
			"protype": "protype",
			"Olivant": "olivant",
			"optfor": "optfor",
			"snapd": "snapd",
			"truly": "truly"
		}
	@end-include
*/

const ate = require( "ate" );
const called = require( "called" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const glucose = require( "glucose" );
const Olivant = require( "olivant" );
const optfor = require( "optfor" );
const proplist = require( "proplist" );
const protease = require( "protease" );
const protype = require( "protype" );
const snapd = require( "snapd" );
const series = require( "async" ).series;
const truly = require( "truly" );

harden( "OPTCALL_DELEGATED", "optcall-delegated" );
harden( "OPTCALL_WRAPPED", "optcall-wrapped" );

const optcall = function optcall( engine ){
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

	if( falzy( engine ) ){
		throw new Error( "engine not given" );
	}

	protease( engine )
		.forEach( function onEachPrototype( prototype ){
			if( prototype.OPTCALL_WRAPPED !== OPTCALL_WRAPPED ){
				ate( "OPTCALL_WRAPPED", OPTCALL_WRAPPED, prototype );
			}

			snapd( function clear( ){ delete prototype.OPTCALL_WRAPPED; } );

			proplist( prototype )
				.forEach( function onEachDefinition( definition ){
					let { property, type, value } = definition;

					if( type == METHOD && optcall.FUNCTION_PATTERN.test( value ) ){
						prototype[ property ] = optcall.wrap( value );
					}
				} );
		} );

	return engine;
};

harden.bind( optcall )
	( "flushCallStack", function flushCallStack( self ){
		while( self.callStack.length ){
			let call = self.callStack.pop( );

			if( truly( call.timeout ) ){
				clearTimeout( call.timeout );

				delete call.timeout;
			}
		}

		return optcall;
	} );

harden.bind( optcall )
	( "clearOption", function clearOption( self ){
		if( truly( self.clearTimeout ) ){
			clearTimeout( self.clearTimeout );

			delete self.clearTimeout;
		}

		self.clearTimeout = snapd.bind( self )
			( function clear( ){
				this.option.clear( );

				Record( "option cache cleared", this.option.cache );
			}, 1000 * 1 ).timeout;

		return optcall;
	} );

harden.bind( optcall )
	( "wrap", function wrap( method ){
		let property = method.name;

		if( method.OPTCALL_DELEGATED === OPTCALL_DELEGATED ){
			return method;
		}

		let delegate = function delegate( option, callback ){
			option = optfor( arguments, OBJECT ) || { };
			let self = option.self || this;

			self.option = self.option || option;
			self.option = glucose.bind( self )( self.option );

			option = glucose.bind( self )( option );

			self.option.mix( option );

			callback = optfor( arguments, FUNCTION );
			callback = called.bind( self )( callback );

			if( self.chainMode === true ){
				if( truly( self.chainTimeout ) ){
					clearTimeout( self.chainTimeout );

					delete self.chainTimeout;
				}

				if( falzy( self.callStack ) ){
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
										( function callbackDelegate( issue, result, option ){
											if( truly( call.timeout ) ){
												clearTimeout( call.timeout );

												delete call.timeout;
											}

											option.result = result;

											resultList.push( result );

											this.option.mix( option );

											if( truly( call.callback ) ){
												call.callback( issue, result, option );
											}

											if( truly( issue ) ){
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
								if( truly( callback ) ){
									callback( issue, resultList.pop( ), this.option );

								}else if( protype( this.emit, FUNCTION ) ){
									this.emit( "done", issue, resultList.pop( ), this.option );
								}

								optcall.flushCallStack( this );

								delete this.chainTimeout;
								delete this.chainMode;

								optcall.clearOption( this );
							} ).bind( this ) );
					} ).timeout;

			}else{
				optcall.clearOption( self );

				return method.bind( self )
					( self.option, called.bind( self )
						( function onResult( issue, result, option ){
							option.result = result;

							this.option.mix( option );

							callback( issue, result, option );
						} ) );
			}

			return self;
		};

		ate( "name", property, delegate );

		ate( "method", method, delegate );

		harden( "OPTCALL_DELEGATED", OPTCALL_DELEGATED, delegate );

		return delegate;
	} );

harden.bind( optcall )
	( "FUNCTION_PATTERN",
		/^function\s+([a-z_$][a-zA-Z0-9_$]+)?\s*\(\s*option\s*\,\s*callback\s*\)/ );

module.exports = optcall;
