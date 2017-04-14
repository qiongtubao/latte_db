
(function() {
	var latte_lib = require("latte_lib");
	var latte_verify = require("latte_verify");
	var toValue = function(v) {
		if(latte_lib.isObject(v)) {
			return JSON.stringify(v);
		}else if(latte_lib.object.isLatteObject(v)){
			return JSON.stringify(v);
		}else{
			return v;
		}
	}
	this.create = function(config) {
		var glass = function(key, value) {
			try {
				value = latte_verify.verify(value, config);
			}catch(err) {
				console.log(value, err);
				return null;
			}
			this.key = key;
			this.data = value;
			this._data = latte_lib.clone(value);
			console.log(value);
		};
		(function() {
			this.set = function(value) {
				try {
					value = latte_verify.verify(value, config);
				}catch(err) {
					console.log("string set error");
					return;
				}
				this.data = value;
			}
			this.get = function() {
				return this.data;
			}
			this.flush = function() {
				this._data = this.data;
			}
		}).call(glass.prototype);
		(function() {
			this.add = function(g) {
				return function(connect, callback) {
					connect.set(g.key, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis string add ", g.key, "return 0");
						}
						return callback(err, g);
					});
				}
			}
			this.update = function(g) {
				return function(connect, callback) {
					connect.set(g.key, toValue(g.data), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis string update ", g.key, "return 0");
						}
						g.flush();
						return callback(err, g);
					});
				}
			}
			this.del = function(g) {
				return function(connect, callback) {
					connect.del(g.key, function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("redis string del ", g.key, "return 0");
						}
						return callback(err, g);
					});
				}
			}
			this.query = function(key) {
				return function(connect, callback) {
					connect.get(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == null) {
							latte_lib.debug.info("redis string query ", key, "return 0");
						}
						var g = new glass(key, data);
						callback(err, g);
					});
				}
			}
			this.create = function(key, value) {
				return new glass(key, value);
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);