
	var latte_lib = require("latte_lib");
	var SqlObject = function(db, table, keys ,data){
		this.keys = keys;
		this.data = data ;
		this.saves = [];
		this.table = table;
		if(latte_lib.isString(db)) {
			this.db = require("../index.js").sql[db];
		}else{
			this.db = db;
		}
		
		//this.defaultData = defaultData;
	};
	(function() {
		this.load = function(callback) {
			//if(!this.defaultData) {
			//	throw new Error("no achieve defaultData");
			//}
			var self = this;
			this.db.command(function(err, client, dbcb) {
				client.query(self.table, self.keys, "*", function(err, data) {
					dbcb(err);
					if(err) {
					
						return callback(err);
					}
					self.data = latte_lib.merger(data[0], this.defaultData || {});
					callback(null, self);
				});
			});	
		}
		this.get = function(key) {
			return this.data[key];
		}
		this.set = function(key, value) {
			this.data[key] = value;
			if(this.saves.indexOf(key) == -1) {
				this.saves.push(key);
			}
		}
		this.remove = function( callback) {
			this.db.command(function(err, client, dbcb) {
				client.delete(self.table, self.keys, function(err, data) {
					dbcb(err);
					if(err) {
					
						return callback(err);
					}
					callback(null, self);
				});
			});
			//connection.delete(this.table, this.keys, )
		}
		this.insert = function( callback) {
			var self = this;
			this.db.command(function(err, client, dbcb) {
				client.insert(self.table, self.data, function(err, data) {
					dbcb(err);
					if(err) {
					
						return callback(err);
					}
					callback(null, self);
				});
			});
		}
		this.save = function( callback) {
			var self = this;
			var updataData = {};
			this.saves.forEach(function(key) {
				updataData[key] = self.data[key];
			});
			this.db.command(function(err, client, dbcb) {
				client.update(self.table, self.keys, updataData, function(err , data) {
					dbcb(err);
					if(err) {
					
						return callback(err);
					}
					self.saves = [];
					callback(null, self);
				});
			});
		}
	}).call(SqlObject.prototype);

	module.exports = SqlObject 
