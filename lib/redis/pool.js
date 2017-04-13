var poolModule = require("../pool.js")
	, redis = require("redis")
	, Connect = require("./connect")
	, creates = {};
(function() {
	this.createPool = function(redisConfig) {
		//var key = mysqlConfig.host + ":" + mysqlConfig.port+ "_" + mysqlConfig.database;
	
		
		var p = new poolModule({
			name: "redis",
			validate: function(client) {
				return client.validate();
			},
			create: function(callback) {
				var client = redis.createClient(redisConfig.port, redisConfig.host);
				redisConfig.password && client.auth((redisConfig.password || ""));
				if(redisConfig.database) {
					client.select(redisConfig.database , function(err, res) {
						if(err) { 
							latte_lib.debug.error("select", redisConfig.database, "faild", err);
							return;
						}									
					});
				}
				var connect = new Connect(client);
				callback(null, connect);
			},
			destroy: function(client) {
				client.close();
			},
			max: redisConfig.maxPoolNum || 1,
			idleTimeoutMills: redisConfig.idleTimeoutMills || 3000,
			logger: redisConfig.logger || false,
			min: redisConfig.minPoolNum || 1
		});
		process.on("exit", function() {
			p.destroyAllNow();
		});
		return p;
	}
}).call(module.exports);