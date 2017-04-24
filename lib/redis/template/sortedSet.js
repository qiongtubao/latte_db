(function() {
	var latte_verify = require("latte_verify")
		, latte_lib = require("latte_lib");
	this.create = function(key, config) {
		var templateClass = function(key, value) {
			this.data = value;
			this._data = value;
			this.change = 0;
			this.key = key;

		};
		(function() {
			this.get = function() {
				return this.data;
			}
			this.set = function(value) {
				this.data = value;
			}
			this.getKey = function() {
				if(latte_lib.isObject(this.key)) {
					return JSON.stringify(this.key);
				}else if(latte_lib.object.isLatteObject(this.key)){
					return JSON.stringify(this.key);
				}else{
					return this.key;
				}
			}
			this.flush = function() {
				this._data = this.data;
			}
			
		}).call(templateClass.prototype);
		var sortedSet = {};
		(function() {
			this.update = function(g) {
				return function(connect, callback) {
					
						connect.zadd(key, g.data, g.getKey(),  function(err, data) {
							if(err) {
								return callback(err);
							}
							g.flush();
							callback(null, g);
						});
					
				}
			}
			this.del = function(g) {
				return function(connect, callback) {
					connect.zrem(key, g.getKey(), function(err, data) {
						if(err) {
							return callback(err);
						}
						return callback(err, data);
					});
				}
			}
			this.delByIndex = function(min, max) {
				return function(connect, callback) {
					connect.zremrangebyrank(key, min, max, function(err, data) {
						if(err) {
							return callback(err);
						}
						return callback(err, data);
					});
				}
			}
			this.delByScore = function(min, max) {
				return function(connect, callback) {
					connect.zremrangebyscore(key, min, max, function(err, data) {
						if(err) {
							return callback(err);
						}
						return callback(err, data);
					});
				}
			}
			this.delAll = function() {
				return function(connect, callback) {
					connect.del(key, function(err, data) {
						if(err) {
							return callback(err);
						}
						return callback(err, data);
					});
				}
			}
			this.getByIndex = function(start, end) {
				var method, min , max;
				if(start < 0 && end < 0 ) {
					if(start < end) {
						method = "zrange";
						min = start;
						max = end;
					}else{
						method = "zrevrange";
						max = start;
						min = end;
					}
				}else if(start > 0 && end > 0) {
					if(start < end) {
						method = "zrange";
						min = start;
						max = end;
					}else{
						method = "zrevrange";
						min = end;
						max = start;
					}
				}else{
					if(start > end) {
						method = "zrange";
						min = start;
						max = end;
					}else{
						method = "zrevrange";
						min = end;
						max = start;
					}
				}
				return function(connect, callback) {
					connect[method](key, min, max, "withscores", function(err, data) {
						if(err) {
							return callback(err);
						}
						var result = [];
						for(var i = 0, len = data.length / 2; i < len; i++) {
							//sorteSet.create(data[2*i]);
							var g = sortedSet.create(data[2*i], data[2*i + 1]);
							result.push(g);
						}
						return callback(err, result);
					});
				}
			}
			this.getAll = function() {
				return function(connect, callback) {
					connect.zrange(key, 0, -1, "WITHSCORES", function(err, data) {
						if(err) {
							return callback(err);
						}
						var result = [];
						for(var i = 0, len = data.length / 2; i < len; i++) {
							//sorteSet.create(data[2*i]);
							var g = sortedSet.create(data[2*i], data[2*i + 1]);
							result.push(g);
						}
						return callback(err, result);
					});
				}
			}
			this.getAllSize = function() {
				return function(connect, callback) {
					connect.zcard(key, callback);
				}
			}
			this.getByScore = function(start, end) {
				var method, min , max;
				if(start < end) {
					method = "zrangebyscore";
					min = start;
					max = end;
				}else{
					method = "zrevrangebyscore";
					min = end;
					max = start;
				}
				return function(connect, callback) {
					connect[method](key, min, max, "withscores",function(err, data) {
						if(err) {
							return callback(err);
						}
						console.log(method, min, max);
						var result = [];
						for(var i = 0, len = data.length / 2; i < len; i++) {
							//sorteSet.create(data[2*i]);
							var g = sortedSet.create(data[2*i], data[2*i + 1]);
							result.push(g);
						}
						return callback(err, result);
					});
				}
			}
			this.getByKey = function(mkey) {
				return function(connect, callback) {
					connect.zscore(key, mkey, function(err, data) {
						if(err) {
							return callback(err);
						}
						var g = sortedSet.create(mkey, data);
						return callback(null, g);
					});
				}
			}
			this.size = function(min, max) {
				return function(connect, callback) {
					connect.zcount(key, min, max, "withscores",function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, data);
					});
					
				}
			}
			
			this.add = function(g) {
				return function(connect, callback) {
					connect.zadd(key, g.data , g.getKey(), function(err, data) {
						if(err) {
							return callback(err);
						}
						callback(null, g);
					});
				}
			}
			this.create = function(data, score) {
				try {
					data = latte_verify.verify(data, config);
				}catch(err) {
					return null;
				}
				return new templateClass(data, score);
			}

		}).call(sortedSet);
		return sortedSet;
	}
}).call(module.exports);