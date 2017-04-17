(function() {
	var latte_lib = require("latte_lib")
		, latte_verify = require("latte_verify");
	this.create = function(key, config) {
		var glass = function(value) {
			this.data = value;
			this._data = latte_lib.clone(value);
		};
		(function() {
			this.toJSON = function() {
				if(latte_lib.isObject(this.data)) {
					return JSON.stringify(this.data);
				}else if(latte_lib.object.isLatteObject(this.data)){
					return JSON.stringify(this.data);
				}else{
					return this.data;
				}
			}
		}).call(glass.prototype);
		var set = {};
		(function() {
			this.getAll = function() {
				return function(connect, callback) {
					connect.smembers(key, function(err, data){
						if(err) {
							return callback(err);
						}
						callback(null, data.map(function(d) {
							return set.create(d);
						}));
					});
				};
			}
			this.size = function() {
				return function(connect, callback) {
					connect.scard(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data);
					});
				};
			}
			this.union = function(setName) {
				return function(connect, callback) {
					connect.sunion(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data.map(function(d) {
							return set.create(d);
						}));
					});
				}
			}
			this.unionSize = function(setName) {
				return function(connect, callback) {
					connect.sunionstore(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data);
					});
				}
			}
			this.inter = function(setName) {
				return function(connect, callback) {
					connect.sinter(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data.map(function(d) {
							return set.create(d);
						}));
					});
				}
			}
			this.interSize = function(setName) {
				return function(connect, callback) {
					connect.sinterstore(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data);
					});
				}
			}
			this.diff = function(setName) {
				return function(connect, callback) {
					connect.sdiff(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data.map(function(d) {
							return set.create(d);
						}));
					});
				};
			}
			this.diffSize = function(setName) {
				return function(connect, callback) {
					connect.sdiffstore(key, setName, function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data);
					});
				}
			}
			this.pop = function() {
				return function(connect, callback) {
					connect.spop(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g = set.create(data);
						callback(null, g);
					});
				}
			}
			this.rand = function() {
				return function(connect, callback) {
					connect.srandmember(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g =  set.create(data);
						callback(null, g);
					});
				}
			}

			
			this.move = function(g, setName) {
				return function(connect, callback) {
					connect.smove(key, g.toJSON(), setName, function(err, data){
						if(err) {
							return callback(err);
						}
						callback(null , data);
					});
				}
			}
			this.has = function(g) {
				return function(connect, callback) {
					connect.sismember(key, g.toJSON(), function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, !!data);
					});
				}
			}


			this.del = function(g) {
				return function(connect, callback) {
					connect.srem(key, g.toJSON(), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("set deled ", key, g.toJSON());
						}
						callback(null, g);
					});
				}
			}
			this.add = function(g) {
				return function(connect, callback) {
					connect.sadd(key, g.toJSON(), function(err, data) {
						if(err) {
							return callback(err);
						}
						if(data == 0) {
							latte_lib.debug.info("set added ", key, g.toJSON());
						}
						callback(null, g);
					});
				};
			}
			this.create = function(value) {
				try {
					value = latte_verify.verify(value, config);
				}catch(err) {
					console.log(err);
					return null;
				}
				return new glass(value);
			}
		}).call(set);
		return set;
	}
}).call(module.exports);