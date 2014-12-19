(function(define) { 'use strict';
	define("moduleName", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("latte_lib");
		function Dao(Pool, config) {
			this.config = config;
			this.pool = Pool.createPool(config);
			this.logger = config.logger || console;
		};
		//1latte_lib.inherits(Dao, latte_lib.events);
		(function() {
			this.quit = function() {
				this.pool.destroyAllNow();
			}
			this.back = function(client) {
				this.pool.release(client);
			}
			this.command = function(func) {
				if(typeof func != "function") {
					return;
				}
				var self = this;
				var pool = this.pool;
				//try {
					pool.acquire(function(error, client) {
						if(!!error) {
							self.logger.error("redis command err cycle:", error);
							return self.command(func);
						}
						func(error, client, function(error) {
							if(error) {
								self.logger.error("redis callback err cycle:", error);
								pool.destroy(client);
							}else{
								pool.release(client);
							}
							
						});
					});
				//}catch(error) {
				//	self.logger.error("try catch error", error);
				//}
			}
			this.info = function() {
				return {
					name: this.pool.getName(),
					poolSize: this.pool.getPoolSize(),
					availableObjectsCount: this.pool.availableObjectsCount(),
					waitingClientsCount: this.pool.waitingClientsCount()
				};
			}
			this.getDb = function() {
				return this.config.database;
			}
		}).call(Dao.prototype);
		(function() {
			var _self = this;
			this.create = function(Pool, config) {
				return new Dao(Pool, config);
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );