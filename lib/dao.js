'use strict'
var latte_lib = require("latte_lib");
function Dao(Pool, config) {
	this.config = config;
	this.pool = Pool.createPool(config);
	this.logger = config.logger || console;
};
(function() {
	this.quit = function() {
		this.pool.destroyAllNow();
	}
	this.back = function(client) {
		this.pool.release(client);
	}
	this.getConnectPromise = function() {
		return require("./utils").thunkToPromise(this.getConnect.bind(this));
	}
	this.getConnect = function(func) {
		if(!latte_lib.isFunction(func)) {
			return;
		}
		var self = this;
		var pool = this.pool;
		pool.acquire(function(error, client) {
			if(!!error) {
				self.logger.error(" getConnect err cycle:", error);
				return self.getConnect(func);
			}
			func(error, client);
		});
		this.info = function() {
			return {
				name: this.pool.getName(),
				poolSize: this.pool.getPoolSize(),
				availableObjectsCount: this.pool.availableObjectsCount,
				waitingClientsCount: this.pool.availableObjectsCount
			};
		}
		this.getDb = function() {
			return this.config.database;
		}
	}
}).call(Dao.prototype);
(function() {
	this.create = function(Pool, config) {
		return new Dao(Pool, config);
	}
}).call(module.exports);