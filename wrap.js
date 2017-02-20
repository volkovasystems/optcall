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
              */var _symbol = require("babel-runtime/core-js/symbol");var _symbol2 = _interopRequireDefault(_symbol);var _for = require("babel-runtime/core-js/symbol/for");var _for2 = _interopRequireDefault(_for);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var ate = require("ate");
var called = require("called");
var depher = require("depher");
var falzy = require("falzy");
var harden = require("harden");
var kloak = require("kloak");
var glucose = require("glucose");
var optfor = require("optfor");
var protype = require("protype");
var raze = require("raze");
var snapd = require("snapd");
var series = require("async").series;
var transpher = require("transpher");
var truly = require("truly");
var truu = require("truu");

harden("CHAIN_MODE", (0, _for2.default)("chain-mode"));
harden("OPTCALL_DELEGATED", "optcall-delegated");

/*;
                                                  	@note:
                                                  		This should not be accessible outside.
                                                  	@end-note
                                                  */
var CHAIN_HANDLER = (0, _symbol2.default)("chain-handler");
var CALL_STACK = (0, _symbol2.default)("call-stack");

var wrap = function wrap(method) {
	/*;
                                  	@meta-configuration:
                                  		{
                                  			"method:required": "function"
                                  		}
                                  	@end-meta-configuration
                                  */

	var property = method.name;

	if (method.OPTCALL_DELEGATED === OPTCALL_DELEGATED) {
		return method;
	}

	var delegate = function delegate(option, callback) {
		var parameter = raze(arguments);

		option = depher(parameter, OBJECT, {});
		var self = option.self || this;

		self.option = self.option || option;
		self.option = glucose.bind(self)(self.option);

		option = glucose.bind(self)(option);

		self.option.mix(option);

		callback = optfor(parameter, FUNCTION);
		callback = called.bind(self)(callback);

		if (self.chained()) {
			if (truly(self[CHAIN_HANDLER])) {
				self[CHAIN_HANDLER].halt();
			}

			if (falzy(self[CALL_STACK])) {
				harden(CALL_STACK, [], self);
			}

			self[CALL_STACK].push({
				"option": option,
				"self": self,
				"method": method,
				"callback": callback });


			self[CHAIN_HANDLER] = snapd.bind(self)(
			function chain() {
				/*;
                     	@todo:
                     		We will drop usage to any async methods from third party modules.
                     	@end-todo
                     */
				series(this[CALL_STACK].
				map(function onEachCall(call, index) {
					/*;
                                          	@note:
                                          		The first call to the chained method will transfer
                                          			the properties to the main option.
                                          	@end-note
                                          */
					if (index === 0) {
						call.option.transfer(this.option);
					}

					return function delegate(tellback) {
						var done = called.bind(this)(
						function done(issue, result, option) {
							call.handler.halt();

							option = glucose.bind(this)(option);

							option.result = result;

							call.callback(issue, result, option);

							/*;
                                             	@note:
                                             		This should be called after the callback.
                                             	@end-note
                                             */
							this.option.mix(option);
							this.option.result = option.result;

							tellback(issue, result);
						});

						call.handler = snapd.bind(this)(
						function fallback() {
							done(new Error("failed to call callback"));
						}, 1000 * 5);

						/*;
                    	@note:
                    		Succeeding calls must communicate through cache and result.
                    	@end-note
                    */
						call.option.mix(this.option);
						call.option.result = this.option.result;

						var option = call.option.empty() ? this.option : call.option;

						call.method.bind(this)(option, done);
					}.bind(this);
				}.bind(this)),

				function lastly(issue, resultList) {
					/*;
                                        	@note:
                                        		This will get the last callback from the chain.
                                        	@end-note
                                        */
					var callback = this[CALL_STACK].reverse()[0].callback;

					var result = resultList.pop();

					callback(issue, result, this.option);

					if (protype(this.emit, FUNCTION)) {
						this.emit("done", issue, result, this.option);
					}

					while (this[CALL_STACK].length) {
						var call = this[CALL_STACK].pop();

						if (truu(call)) {
							call.handler.halt();
						}
					}

					this[CHAIN_HANDLER].halt();
					this.release();

					snapd.bind(this)(this.option.clear, 1000 * 1);
				}.bind(this));
			});

		} else {
			snapd.bind(this)(this.option.clear, 1000 * 1);

			return method.bind(self)(
			option.empty() ? self.option : option, called.bind(self)(
			function onResult(issue, result, option) {
				option.result = result;

				this.option.mix(option);
				this.option.transfer(option);

				callback(issue, result, option);
			}));
		}

		return self;
	};

	kloak(method, delegate, OPTCALL_DELEGATED, property);

	return delegate;
};

module.exports = wrap;

//# sourceMappingURL=wrap.js.map