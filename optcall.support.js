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
              */var _for = require("babel-runtime/core-js/symbol/for");var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var ate = require("ate");
var clazof = require("clazof");
var falzy = require("falzy");
var harden = require("harden");
var proplist = require("proplist");
var protease = require("protease");
var protype = require("protype");
var snapd = require("snapd");
var vound = require("vound");

var wrap = require("./wrap.js");
var FUNCTION_PATTERN = /^function\s+([a-z_$][a-zA-Z0-9_$]+)?\s*\(\s*option\s*\,\s*callback\s*\)/;

harden("CHAIN_MODE", (0, _for2.default)("chain-mode"));
harden("OPTCALL_WRAPPED", "optcall-wrapped");

var optcall = function optcall(engine) {
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

	if (falzy(engine)) {
		throw new Error("engine not given");
	}

	protease(engine).
	forEach(function onEachPrototype(prototype) {
		if (prototype.OPTCALL_WRAPPED !== OPTCALL_WRAPPED) {
			ate("OPTCALL_WRAPPED", OPTCALL_WRAPPED, prototype);

		} else {
			return;
		}

		snapd.bind(prototype)(function clear() {delete prototype.OPTCALL_WRAPPED;});

		proplist(prototype).
		forEach(function onEachDefinition(definition) {var
			property = definition.property,type = definition.type,value = definition.value;

			if (type == FUNCTION && FUNCTION_PATTERN.test(value)) {
				prototype[property] = wrap(value);
			}
		});
	});

	/*;
     	@note:
     		Attach helper methods.
     	@end-note
     */
	var chain = function chain() {
		this[CHAIN_MODE] = true;

		return this;
	};

	var release = function release() {
		this[CHAIN_MODE] = false;

		return this;
	};

	var chained = function chained() {
		return this[CHAIN_MODE] || false;
	};

	if (protype(engine, FUNCTION)) {
		engine.prototype.chain = chain;
		engine.prototype.release = release;
		engine.prototype.chained = chained;

	} else if (protype(engine, OBJECT) && clazof(engine, engine.constructor)) {
		engine.constructor.prototype.chain = chain;
		engine.constructor.prototype.release = release;
		engine.constructor.prototype.chained = chained;

		engine.chain = vound(chain, engine);
		engine.release = vound(release, engine);
		engine.chained = vound(chained, engine);
	}

	return engine;
};

module.exports = optcall;

//# sourceMappingURL=optcall.support.js.map