"use strict";

/*;
	@module-license:
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
	@end-module-license

	@module-configuration:
		{
			"package": "optcall",
			"path": "optcall/optcall.js",
			"file": "optcall.js",
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
	@end-module-configuration

	@module-documentation:
		Delegate option-callback procedures.

		This method will insert helper methods, chain, release and chained to the class.
	@end-module-documentation

	@include:
		{
			"ate": "ate",
			"clazof": "clazof",
			"falzy": "falzy",
			"harden": "harden",
			"proplist": "proplist",
			"protease": "protease",
			"protype": "protype",
			"snapd": "snapd",
			"vound": "vound"
		}
	@end-include
*/

const ate = require( "ate" );
const clazof = require( "clazof" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const proplist = require( "proplist" );
const protease = require( "protease" );
const protype = require( "protype" );
const snapd = require( "snapd" );
const vound = require( "vound" );

const wrap = require( "./wrap.js" );
const FUNCTION_PATTERN = /^function\s+([a-z_$][a-zA-Z0-9_$]+)?\s*\(\s*option\s*\,\s*callback\s*\)/;

harden( "CHAIN_MODE", Symbol.for( "chain-mode" ) );
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

					if( type == FUNCTION && FUNCTION_PATTERN.test( value ) ){
						prototype[ property ] = wrap( value );
					}
				} );
		} );

	/*;
		@note:
			Attach helper methods.
		@end-note
	*/
	let chain = function chain( ){
		this[ CHAIN_MODE ] = true;

		return this;
	};

	let release = function release( ){
		this[ CHAIN_MODE ] = false;

		return this;
	};

	let chained = function chained( ){
		return ( this[ CHAIN_MODE ] || false );
	};

	if( protype( engine, FUNCTION ) ){
		engine.prototype.chain = chain;
		engine.prototype.release = release;
		engine.prototype.chained = chained;

	}else if( protype( engine, OBJECT ) && clazof( engine, engine.constructor ) ){
		engine.constructor.prototype.chain = chain;
		engine.constructor.prototype.release = release;
		engine.constructor.prototype.chained = chained;

		engine.chain = vound( chain, engine );
		engine.release = vound( release, engine );
		engine.chained = vound( chained, engine );
	}

	return engine;
};

module.exports = optcall;
