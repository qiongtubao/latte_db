var poolModule = require("../../pool")
	, mysql = require("mysql")
	, Sql = require("./sql.js")
	, creates = {};
(function() {
	this.createPool = function(mysqlConfig) {
		var key = mysqlConfig.host+":"+mysqlConfig.port+"_"+mysqlConfig.database;
		creates[key] = [];
		var logger = mysqlConfig.logger || console;
		console.log(mysqlConfig);
		var p = new poolModule.Pool({
			name: "mysql",
			validate: function(client) {
				return true;
			},
			create: function(callback) {
				
				var conn = mysql.createConnection({
					host: mysqlConfig.host,
					user: mysqlConfig.user,
					password: mysqlConfig.password,
					database: mysqlConfig.database,
					port: mysqlConfig.port || 3306
				});
				conn .connect();
				//throw new Error("create one ");
				var sql = new Sql(conn);
				callback(null, sql);
				 
			},
			destroy: function(client) {						
				client.end();			
			},
			max: mysqlConfig.maxPoolNum || 1,
			idleTimeoutMillis: mysqlConfig.idleTimeoutMillis || 3000,
			log: mysqlConfig.log || false,
			min: mysqlConfig.minPoolNum || 1
		});
		process.on("exit", function() {
			p.destroyAllNow();
		});
		return p;
	}

	
}).call(module.exports);