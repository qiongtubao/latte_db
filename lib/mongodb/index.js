(function(define) { 'use strict';
	define("latte_db/mongodb/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var Pool = require("./pool")
			, Dao = require("../dao");
		(function() {
			var _self = this;
			this.bindDb = function(name, config) {
				_self[name] = Dao.create(Pool, config);
				return _self;
			}
			this.create = function(config) {
				return  Dao.create(Pool, config);
			}
			this.createOne = function(config, callback) {
				return Pool.createOne(config, callback);
			}
			this.toObjectID = Pool.toObjectID;
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );