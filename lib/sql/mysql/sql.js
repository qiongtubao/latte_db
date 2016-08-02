	var latte_lib = require("latte_lib");
	var defaultConfig = {
		log: console.log
	};
	var SqlBasic = require("../sql.js");
	var Sql = function(connection, config) {
		this.connection = connection;
		this.config  = latte_lib.merger(config || {}, defaultConfig);
		
	};
	latte_lib.inherits(Sql, SqlBasic );
	(function() {
		this.sql = function(sql , callback) {
			this.connection.query(sql, callback);
		}
		this.end = function() {
			this.connection.end();
		}
	}).call(Sql.prototype);
	module.exports = Sql;
