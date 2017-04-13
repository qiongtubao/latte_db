(function() {
	var latte_lib = require("latte_lib");
	var latte_verify = require("latte_verify");
	this.create = function(config) {
		var glass = function(key, data) {
			this.key = key;
			try {
				data = latte_verify.verify(data, {
					type: "object",
					properties: config
				});
			}catch(e) {
				console.log("redis hash key :" ,key, e);
				return null;
			}
			this.data = latte_lib.object.create(data);
			this.updateData = latte_lib.object.create({});
			this._data = latte_lib.object.create(latte_lib.copy(data) || {});
			this.data.on("change", function(key, value) {
				self.updateData.set(key, value);
			});
		};
		(function() {
			this.get = function(key) {
				return this.data.get(key);
			}
			this.set = function(key, value) {
				if(key.indexOf(".") == -1) {
					try {
						value = latte_verify.verify(value ,config[key]); 
					}catch(e) {
						throw e;
					}
				}
				this.data.set(key, value);
			}
			this.getUpdates = function() {
				var result = {};
				var self = this;
				Object.keys(this.updateData.data).forEach(function(key) {
					result[key] = self.data.data[key];
				});
				return result;
			}
			this.flush = function() {
				this._data = latte_lib.object.create(latte_lib.copy(this.data.data));
				this.updateData = latte_lib.object.create({});
			}
			
		}).call(glass.prototype);
		(function() {
			this.add = function(g) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("add callback is not Function");
						callback = function(){}
					}
					connect.hset(g.key,  g.data.data, function(err, result0, result1) {
						if(err) { return callback(err); }
						
						callback(null, g);
					});
				}
			}
			this.del = function(g) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("add callback is not Function");
						callback = function(){}
					}
					connect.del(g.key, function(err, result0) {
						if(err) { return callback(err); }
						callback(null, g);
					});
				};
			}
			this.update = function(g) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("update callback is not Function");
						callback = function(){}
					}
					connect.update(g.key, g.getUpdates(), function(err, result0) {
						if(err) { return callback(err); }
						callback(null, g);
					});
				};
			}
			this.query = function(key) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("update callback is not Function");
						callback = function(){}
					}
					connect.hmget(key, Object.keys(config), function(err, data) {
						if(err) { return callback(err); }
						var g = new glass(key, data);
						callback(null, g);
					});
				}
			}
			this.keys = function(key) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("queryAll callback is not Function");
						callback = function(){}
					}
					connect.keys(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(err, data);
					});
				}
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);