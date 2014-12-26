(function(define) { 'use strict';
	define("latte_db/redis/pool", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var poolModule = require("../pool")
		//var poolModule = require("generic-pool")
			, redis = require("redis")
			, creates = {};
		/*process.on("exit", function() {
			for(var i in creates) {
				creates[i].forEach(function(client) {
					client.end();
				});
			}
		});*/
		(function() {
			this.createPool = function(redisConfig) {
				var key = redisConfig.host+":"+redisConfig.port+"_"+redisConfig.database;
				creates[key] = [];
				var logger = redisConfig.logger || console;
				var p = new poolModule.Pool({
					name: "redis",
					validate: function(client) {
						return client && client.stream && client.stream._connecting;
					},
					create: function(callback) {
						var client = redis.createClient(redisConfig.port, redisConfig.host);
						client.auth((redisConfig.password || ""));
						client.select(redisConfig.database || 0, function(err, res) {
							if(err) { 
								logger.error("select", redisConfig.database, "faild", err);
								callback(err);
								return;
							}	
							
						});
						callback(null, client);	
						//creates[key].push(client);
						//callback(null, client);
						var self = this;
						 client.on("error", function(err) {
						 	//self.destroy(client);
						 	logger.error("redis client error:", err);
						 });
						 
					},
					destroy: function(client) {
						
						client.end();
						client.quit();
						//var index = creates[key].indexOf(client);
						//creates[key].splice(index,1);						
					},
					max: redisConfig.maxPoolNum || 3000,
					idleTimeoutMillis: redisConfig.idleTimeoutMillis,
					log: redisConfig.log || false,
					min: redisConfig.minPoolNum || 10
				});
				process.on("exit", function() {
					p.destroyAllNow();
				});
				return p;
			}

		}).call(module.exports);

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );