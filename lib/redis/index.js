(function(define) { 'use strict';
	define("latte_db/redis", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var Pool = require("./pool")
			, Dao = require("../dao")
			, fs = require("fs");
		(function() {
			var _self = this;
			this.bindDb = function(name, config) {
				_self[name] = Dao.create(Pool, config);
				return _self;
			}
			this.create = function(config) {
				return  Dao.create(Pool, config);
			}

		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );