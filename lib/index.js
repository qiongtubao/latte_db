(function(define) { 'use strict';
	define("moduleName", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function() {
			this.redis = require("./redis");
			this.mongodb = require("./mongodb");
			this.mongodb_ = require("./mongodb_");
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );