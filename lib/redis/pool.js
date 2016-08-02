(function(define) { 'use strict';
	define("latte_db/redis/pool", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var poolModule = require("../pool")
			, latte_lib = require("latte_lib")
			, redis = require("redis")
			, creates = {};
	
		(function() {
				var create = function(redisConfig, logger) {
					logger = logger || {error: function(err) { }}; 
					return function(callback) {
						var onceCallback = function(error, client) {
							callback(error, client);
							callback = function() {};
						};
						var client = redis.createClient(redisConfig.port, redisConfig.host);
						redisConfig.password && client.auth((redisConfig.password || ""));
						/**
						var client = redis.createClient({
							port: redisConfig.port,
							host: redisConfig.host,
							password: redisConfig.password || ""
						});
*/
						//client.auth(redisConfig.password || "");
							client.select(redisConfig.database || 0, function(err, res) {
								if(err) { 
									logger.error("select", redisConfig.database, "faild", err);
									onceCallback(err);
									return;
								}									
							});
						onceCallback(null, client);
						var self = this;
						 client.on("error", function(err) {
						 	logger.error("redis client error:", err);
						 	onceCallback(err);
						 });						 
					};
				};
				var destroy = function(client) {			
					//client.end();
					client.quit();		
				}; 
			this.createPool = function(redisConfig) {
				var key = redisConfig.host+":"+redisConfig.port+"_"+redisConfig.database;
				creates[key] = [];
				var logger = redisConfig.logger || console;
				var p = new poolModule.Pool({
					name: "redis",
					validate: function(client) {
						return client && client.stream && client.stream._connecting;
					},
					create: create(redisConfig, logger),
					destroy: destroy,
					max: redisConfig.maxPoolNum || 100,
					idleTimeoutMillis: redisConfig.idleTimeoutMillis || 3000,
					log: redisConfig.log || false,
					min: redisConfig.minPoolNum || 10
				});
				process.on("exit", function() {
					p.destroyAllNow();
				});
				return p;
			}
			this.createOne = function(redisConfig, callback) {
				create(redisConfig)(function(err, client) {
					callback(err, client, function() {
						destroy(client);
					});
				});
			}
		}).call(module.exports);

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );