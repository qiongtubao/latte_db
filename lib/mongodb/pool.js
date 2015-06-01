(function(define) { 'use strict';
	define("latte_db/mogodb/pool", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var poolModule = require("../pool")
			, mongodb = require("mongodb")
			, toObjectID = function (hex) {
			  if (hex instanceof mongodb.ObjectID) {
			    return hex;
			  }
			  if (!hex || hex.length !== 24) {
			    return hex;
			  }
			  return mongodb.ObjectID.createFromHexString(hex);
			};
		(function() {
				var create = function(mongodbConfig, logger) {
					logger = logger || function(){}; 
					return function(callback) {
						var onceCallback = function(error, client) {
							callback(error, client);
							callback = function() {};
						}
						var  MongoClient = require("mongodb").MongoClient
							, format = require("util").format;
						
						var server_options = {"auto_reconnect": false, poolSize: 1};
						var db_options = {w: -1};
						var mongoserver =  new mongodb.Server(mongodbConfig.host, mongodbConfig.port, server_options);
						var db = new mongodb.Db(mongodbConfig.database, mongoserver, db_options) ;
						db.toObjectID = toObjectID;
						db.open(function(err, db) {
							if(err) { return callback(err); }
							mongodbConfig.collections.forEach(function(value) {
								db[value] = db.collection(value);
							});
							onceCallback(null, db);

						});
						db.on("error", function(err) {
							logger.error("mongodb error:",err);
							onceCallback(err);
							//p.destroy(db);
						});
						

					};
				}
				var destroy = function(client) {
					client.close();	
				}
			this.createPool = function(mongodbConfig) {
				var logger = mongodbConfig.logger || { error:function(){} };
				var p = new poolModule.Pool({
					name: "mongodb",
					create: create(mongodbConfig, logger),
					destroy: destroy,
					max: mongodbConfig.maxPoolNum || 100,
					idleTimeoutMillis: mongodbConfig.idleTimeoutMillis || 30000,
					log: mongodbConfig.log || false,
					min: mongodbConfig.minPoolNum || 10
				});
				process.on("exit", function() {
					p.destroyAllNow();
				});
				return p;
			}
			this.createOne = function(mongodbConfig, callback) {
				create(mongodbConfig)(function(err, client) {
					callback(err, client, function() {
						destroy(client);
					});
				});
			}

		}).call(module.exports);

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); } );
