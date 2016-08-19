	var SqlUtils = require("./sqlUtils");
	var defaultConfig = {
		log: console.log
	};
	var Sql = function(db) {
		
	};

	(function() {
		this.sql = function() {
			throw  new Error("not achieve sql");
		}
		this.insert = function(table, object, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(SqlUtils.insertString.apply(null, args), callback);
		}
		this.update = function(table, querys, sets, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(SqlUtils.updateString.apply(null, args), callback);
		}
		this["delete"]= function(table, querys, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(SqlUtils.deleteString.apply(null, args), callback);
		}
		this.query = function(table, querys, keys, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(SqlUtils.queryString.apply(null, args), callback);
		}
		this.removeTable = function(table, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(SqlUtils.removeTable.apply(null, args), callback);
		}
		this.createTable = function(table, object, callback) {
			var args = Array.prototype.splice.call(arguments, 0);
			callback = args.pop();
			this.sql(this.getInsertSql.apply(null, args), callback);
		}
		this.doCommand = function(commnd, param,callback) {
			if(!this[commnd] ) {
				return callback(new Error("doCommand param Error"));
			}
			param.push(callback);
			this[commnd].apply(this, param);
		}
		this.end = function() {
			throw  new Error("not achieve sql");
		}
		
	}).call(Sql.prototype);
	module.exports = Sql;
