(function(define) { 'use strict';
	define("latte_db/mogodb/pool", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var poolModule = require("../pool")
		//var poolModule = require("generic-pool")
			, mongodb = require("mongoskin");
		(function() {
			this.createPool = function(mongodbConfig) {
				var logger = mongodbConfig.logger || { error:function(){} };
				var p = new poolModule.Pool({
					name: "mongodb",
					create: function(callback) {
						var url = "mongodb://"+mongodbConfig.host + ":" + mongodbConfig.port + 
							"/" + mongodbConfig.database;
						var db = mongodb.db(url, {navtive_parser: true});
						if(mongodbConfig.collections) {
							mongodbConfig.collections.forEach(function(collection, index) {
								db.bind(collection);
							});
						}
						
						callback(null, db);
					},
					destroy: function(client) {
						client.close();					
					},
					max: mongodbConfig.maxPoolNum || 3000,
					idleTimeoutMillis: mongodbConfig.idleTimeoutMillis ,
					log: mongodbConfig.log || false,
					min: mongodbConfig.minPoolNum || 10
				});
				process.on("exit", function() {
					p.destroyAllNow();
				});
				return p;
			}

		}).call(module.exports);

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );