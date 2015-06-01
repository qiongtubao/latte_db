(function(define) { 'use strict';
	define("latte_db/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function() {
			this.redis = require("./redis");
			this.mongodb = require("./mongodb");
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );