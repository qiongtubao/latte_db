(function() {
	var latte_verify = require("latte_verify");
	var latte_lib = require("latte_lib");
	this.create = function(key, config) {
		var toValue = function(v) {
			if(latte_lib.isObject(v)) {
				return JSON.stringify(v);
			}else if(latte_lib.object.isLatteObject(v)){
				return JSON.stringify(v);
			}else{
				return v;
			}
		}
		var glass = function(value) {
			try {
				value =latte_verify.verify(value, config);
			}catch(err) {
				console.log("list object verify Error", err);
				return null;
			}
			this.data = value;
			this._data = latte_lib.clone(value);
		};
		(function() {
			this.set = function(value) {
				try {
					value =latte_verify.verify(value, config);
				}catch(err) {
					console.log("list object verify Error", err);
					return null;
				}
				this.data = value;
			}
			this.get = function() {
				return this.data;
			}
			this.flush = function() {
				this._data = latte_lib.clone(value);
			}
		}).call(glass.prototype);
		(function() {
			this.push = function(g) {
				return function(connect, callback) {
					connect.rpush(key, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis list push ", key, "return 0");
						}
						return callback(null, g);
					});
				}
			}
			
			this.size = function() {
				return function(connect, callback) {
					connect.llen(key, callback);
				}
			}
			
			this.unshift = function(g) {
				return function(connect, callback) {
					connect.lpush(key, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis list push ", key, "return 0");
						}
						return callback(null, g);
					});
				}
			}
			
			this.shift = function() {
				return function(connect, callback) {
					connect.lpop(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data) {
							var g = new glass(data);
							return callback(null, g);
						}else{
							return callback();
						}
					});
				}
			}
			
			this.pop = function() {
				return function(connect, callback) {
					connect.rpop(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data) {
							var g = new glass(data);
							return callback(null, g);
						}else{
							return callback();
						}
					});
				}
			}
			
			this.waitShift = function() {
				return function(connect, callback) {
					connect.blpop([key], 0, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g =  new glass(data[1]);
						callback(null, g);
					});
				}
			}
			
			this.waitPop = function() {
				return function(connect, callback) {
					connect.brpop([key], 0, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g =  new glass(data[1]);
						callback(null, g);
					});
				}
			}

			this.getAll = function(min, max) {
				if(min == null) {
					min = 0;
				}
				if(max == null) {
					max = -1
				}
				return function(connect, callback) {
					connect.lrange(key, min, max, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data.map(function(o) {
							return new glass(o);
						}));
					});
				}
			}
			
			this.create = function(value) {
				return new glass(value);
			}
			this.get = function(index) {
				return function(connect, callback) {
					connect.lindex(key, index, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g = new glass(data);
						callback(null, g);
					});
				};
			}
			this.set = function(index, g) {
				return function(connect, callback) {
					connect.lset(key, index, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis list set ", key, index, "return 0");
						}
						callback(null, g);
					});
				};
			}
			this.del = function(g, index) {
				if(index == null) {
					index = 1;
				}
				return function(connect, callback) {
					connect.lrem(key, 1, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis list del ", key, index, "return 0");
						}
						callback(null, data);
					});
				};
			}
			this.delAll = function() {
				return function(connect, callback) {
					connect.del(key, function(err, data){
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis list delAll ", key, index, "return 0");
						}
						callback(null, data);
					});
				};
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);