var poolModule = require("../pool")
	,  Sql3 = require("sqlite3");
	, Sql = require("./sql")
	, creates = {};
(function() {
	this.createPool = function(mysqlConfig) {
		var key = mysqlConfig.host+":"+mysqlConfig.port+"_"+mysqlConfig.database;
		creates[key] = [];
		var logger = mysqlConfig.logger || console;
		var p = new poolModule.Pool({
			name: "mysql",
			validate: function(client) {
				return true;
			},
			create: function(callback) {
				
				var db = new Sql3.Database(sqlConfig.database, function(){
					var sqlite3 = new Sqlite3(db, sqlConfig);
					var sql = new Sql(sqlite3);
					callback(null, sql);
				});
			
				 
			},
			destroy: function(client) {						
				client.end();			
			},
			max: mysqlConfig.maxPoolNum || 3000,
			idleTimeoutMillis: mysqlConfig.idleTimeoutMillis,
			log: mysqlConfig.log || false,
			min: mysqlConfig.minPoolNum || 10
		});
		process.on("exit", function() {
			p.destroyAllNow();
		});
		return p;
	}

	
}).call(module.exports);