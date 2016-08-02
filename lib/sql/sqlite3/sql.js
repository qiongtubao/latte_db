	var defaultConfig = {
		log: config.log
	};
	var SqlBasic = require("../sql.js");
	var Sql = function(connection, config) {
		this.connection = connection;
		this.config  = latte_lib.merger(config || {}, defaultConfig);
		
	};
	latte_lib.inherits(SqlBasic, Sql);
	(function() {
		this.sql = function(sql , callback) {
			this.connection.run(sql, callback);
		}
		this.end = function() {
			this.connection.close();
		}
	}).call(Sql.prototype);
	module.exports = Sql;
