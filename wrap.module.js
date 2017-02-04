"use strict";

/*;
	@submodule-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
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
	@end-submodule-license

	@submodule-configuration:
		{
			"package": "optcall",
			"path": "optcall/wrap.js",
			"file": "wrap.js",
			"module": "optcall",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/optcall.git",
			"test": "optcall-test.js",
			"global": true
		}
	@end-submodule-configuration

	@submodule-documentation:
		Wrapper function for option callback procedure.
	@end-submodule-documentation

	@include:
		{
			"async": "async",
			"ate": "ate",
			"called": "called",
			"depher": "depher",
			"falzy": "falzy",
			"harden": "harden",
			"kloak": "kloak",
			"glucose": "glucose",
			"optfor": "optfor",
			"protype": "protype",
			"raze": "raze",
			"snapd": "snapd",
			"transpher": "transpher",
			"truly": "truly",
			"truu": "truu"
		}
	@end-include
*/

const ate = require( "ate" );
const called = require( "called" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const kloak = require( "kloak" );
const glucose = require( "glucose" );
const optfor = require( "optfor" );
const protype = require( "protype" );
const raze = require( "raze" );
const snapd = require( "snapd" );
const series = require( "async" ).series;
const transpher = require( "transpher" );
const truly = require( "truly" );
const truu = require( "truu" );

harden( "CHAIN_MODE", Symbol.for( "chain-mode" ) );
harden( "OPTCALL_DELEGATED", "optcall-delegated" );

/*;
	@note:
		This should not be accessible outside.
	@end-note
*/
const CHAIN_HANDLER = Symbol( "chain-handler" );
const CALL_STACK = Symbol( "call-stack" );

const wrap = function wrap( method ){
	/*;
		@meta-configuration:
			{
				"method:required": "function"
			}
		@end-meta-configuration
	*/

	let property = method.name;

	if( method.OPTCALL_DELEGATED === OPTCALL_DELEGATED ){
		return method;
	}

	let delegate = function delegate( option, callback ){
		let parameter = raze( arguments );

		option = depher( parameter, OBJECT, { } );
		let self = option.self || this;

		self.option = self.option || option;
		self.option = glucose.bind( self )( self.option );

		option = glucose.bind( self )( option );

		self.option.mix( option );

		callback = optfor( parameter, FUNCTION );
		callback = called.bind( self )( callback );

		if( self.chained( ) ){
			if( truly( self[ CHAIN_HANDLER ] ) ){
				self[ CHAIN_HANDLER ].halt( );
			}

			if( falzy( self[ CALL_STACK ] ) ){
				harden( CALL_STACK, [ ], self );
			}

			self[ CALL_STACK ].push( {
				"option": option,
				"self": self,
				"method": method,
				"callback": callback
			} );

			self[ CHAIN_HANDLER ] = snapd.bind( self )
				( function chain( ){
					/*;
						@todo:
							We will drop usage to any async methods from third party modules.
						@end-todo
					*/
					series( this[ CALL_STACK ]
						.map( ( function onEachCall( call, index ){
							/*;
								@note:
									The first call to the chained method will transfer
										the properties to the main option.
								@end-note
							*/
							if( index === 0 ){
								call.option.transfer( this.option );
							}

							return ( function delegate( tellback ){
								let done = called.bind( this )
									( function done( issue, result, option ){
										call.handler.halt( );

										option = glucose.bind( this )( option );

										option.result = result;

										call.callback( issue, result, option );

										/*;
											@note:
												This should be called after the callback.
											@end-note
										*/
										this.option.mix( option );
										this.option.result = option.result;

										tellback( issue, result );
									} );

								call.handler = snapd.bind( this )
									( function fallback( ){
										done( new Error( "failed to call callback" ) );
									}, 1000 * 5 );

								/*;
									@note:
										Succeeding calls must communicate through cache and result.
									@end-note
								*/
								call.option.mix( this.option );
								call.option.result = this.option.result;

								let option = call.option.empty( )? this.option : call.option;

								call.method.bind( this )( option, done );
							} ).bind( this );
						} ).bind( this ) ),

						( function lastly( issue, resultList ){
							/*;
								@note:
									This will get the last callback from the chain.
								@end-note
							*/
							let callback = this[ CALL_STACK ].reverse( )[ 0 ].callback;

							let result = resultList.pop( );

							callback( issue, result, this.option );

							if( protype( this.emit, FUNCTION ) ){
								this.emit( "done", issue, result, this.option );
							}

							while( this[ CALL_STACK ].length ){
								let call = this[ CALL_STACK ].pop( );

								if( truu( call ) ){
									call.handler.halt( );
								}
							}

							this[ CHAIN_HANDLER ].halt( );
							this.release( );

							snapd.bind( this )( this.option.clear, 1000 * 1 );
						} ).bind( this ) );
				} );

		}else{
			snapd.bind( this )( this.option.clear, 1000 * 1 );

			return method.bind( self )
				( ( option.empty( )? self.option : option ), called.bind( self )
					( function onResult( issue, result, option ){
						option.result = result;

						this.option.mix( option );
						this.option.transfer( option );

						callback( issue, result, option );
					} ) );
		}

		return self;
	};

	kloak( method, delegate, OPTCALL_DELEGATED, property );

	return delegate;
};

module.exports = wrap;
