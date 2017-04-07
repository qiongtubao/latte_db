var poolModule = require("../../pool.js")
	, mysql = require("mysql2")
	, Connect = require("./connect")
	, creates = {};
(function() {
	this.createPool = function(mysqlConfig) {
		//var key = mysqlConfig.host + ":" + mysqlConfig.port+ "_" + mysqlConfig.database;
	
		var logger = mysqlConfig.logger || console;
		var p = new poolModule({
			name: "mysql",
			validate: function(client) {
				return true;
			},
			create: function(callback) {
				var conn = mysql.createConnection( {
					host: mysqlConfig.host,
					user: mysqlConfig.user,
					password: mysqlConfig.password,
					database: mysqlConfig.database,
					port: mysqlConfig.port || 3306,

				});
				
				var connect = new Connect(conn);
				callback(connect);
			},
			destroy: function(client) {
				client.close();
			},
			max: mysqlConfig.maxPoolNum || 1,
			idleTimeoutMills: mysqlConfig.idleTimeoutMills || 3000,
			logger: mysqlConfig.logger || false,
			min: mysqlConfig.minPoolNum || 1
		});
		process.on("exit", function() {
			p.destroyAllNow();
		});
		return p;
	}
}).call(module.exports);