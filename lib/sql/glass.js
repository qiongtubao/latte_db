var latte_lib = require("latte_lib")
	, latte_verify = require("latte_verify");
(function() {
	this.create = function(tableName, config) {
		var uniques = {};
		var key;
		for(var i in config) {
			if(config[i].key != null) {
				key = i;
			}
			if(config[i].unique != null) {
				uniques[config[i].unique] =  uniques[config[i].unique] || [];
				uniques[config[i].unique].push(i);
			}
		}
		var getWhere = function(g) {
			return g.getWhere();
		}
		var glass = function(data) {
			try {
				data = latte_verify.verify(data, {
					type: "object",
					properties: config
				});
			} catch(e) {
				console.log(e);
			}
			
			this.data = latte_lib.object.create(data || {});
			this.updateData = latte_lib.object.create({});
			this._data = latte_lib.object.create(latte_lib.copy(data) || {});
			var self = this;
			
			this.data.on("change", function(key, value) {
				self.updateData.set(key, value);
			});
			
		};
		(function() {
			this.update = function(data) {
				for(var key in data) {
					this.data.set(key, data[key]);
				}
			}
			this.getWhere = function() {
				var result = {};
				if(this._data.get(key)) {
					result[key] = this._data.get(key);
					return result;
				}
				for(var i in uniques) {
					var r = true;
					for(var k = 0, len = uniques[i].length ; k < len; k++) {
						if(this._data.get(uniques[i][k]) == null) {
							r = false;
							break;
						}else{
							result[uniques[i][k]] = this._data.get(uniques[i][k]);
						}
					}
					if(r == true) {
						return result;
					}else{
						result = {};
					}
				}

				return this._data.data;
			}
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
			this.toJSON = function() {
				return this.data.toJSON();
			}
		}).call(glass.prototype);
		(function() {
			this.queryOnePromise = function(wheres) {
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.queryOne(wheres), connect)
				}
			}
			this.queryOne = function(wheres, options) {
				if(wheres.constructor == glass) {
					wheres = wheres.data.data;
				}
				return function(connect, callback) {
					options = options || {};
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("queryOne callback is not Function");
						callback = function(){}
					}
					options.projection =  options.projection || config;
					options.limie = [0,1];
					connect.query(tableName, wheres, options, function(err, d) {
						if(err) { return callback(err); }
						callback(null,  d[0]? glass.create(d[0]) : null);
					});
				}
			}
			this.queryPromise = function(wheres, options) {
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.query(wheres, options), connect);
				}
			}
			this.query = function(wheres, options) {
				if(wheres.constructor == glass) {
					wheres = wheres.data.data;
				}
				return function(connect, callback) {
					options = options || {};
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("query callback is not Function");
						callback = function(){}
					}
					options.projection = options.projection || config;
					connect.query(tableName, wheres, options, function(err, data) {
						if(err) { return callback(err); }
						callback(null, data.map(function(d) {
							return glass.create(d);
						}));
					});
				}
			}
			this.updatePromise = function(wheres, update) {
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.update(wheres, update), connect);
				}
			}
			this.update = function(wheres, update) {
				var self = this;
				var g;
				if(wheres.constructor == glass){
					g = wheres;
					update = wheres.getUpdates();
					wheres = getWhere(wheres);
				}
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("update callback is not Function");
						callback = function(){}
					}
					connect.update(tableName, update, wheres,  function(err, result0, result1) {
						g && g.flush();
						callback(err, wheres);
					});
				}
			}
			this.delPromise = function(wheres) {
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.del(wheres), connect);
				}
			}
			this.del = function(wheres) {
				var self = this;
				if(wheres.constructor == glass){
					wheres = getWhere(wheres);
				}
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("del callback is not Function");
						callback = function(){}
					}
					connect.del(tableName, wheres, function(err, result0, result1) {
						callback(err, self);
					});
				}
			}
			this.addPromise = function(g) {				
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.add(g), connect);
				}
			}
			this.add = function(g) {
				var self = this;
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("add callback is not Function");
						callback = function(){}
					}
					connect.add(tableName,  g.data.data, function(err, result0, result1) {
						if(err) { return callback(err); }
						if(config[key].type == "integer") {
							connect.addKey(key, g, result0, result1);
						}
						callback(null, g);
					});
				}
			}
			this.create = function(data) {

				return new glass(latte_lib.copy(data));
			}
			this.count = function(wheres) {
				var self = this;
				if(wheres.constructor == glass){
					wheres = getWhere(wheres);
				}
				return function(connect, callback) {
					if(!latte_lib.isFunction(callback)) {
						latte_lib.debug.error("count callback is not Function");
						callback = function(){};
					}
					connect.count(tableName, wheres, {}, function(err, result0, result1) {
						if(err) {
							return callback(err);
						}
						if(result0[0] != null && result0[0]["count(1)"] != null) {
							return callback(null, result0[0]["count(1)"]);
						}else{
							callback(new Error("latte_db glass count has bug"));
						}

					});
				}
			}
			this.countPromise = function(g) {
				var self = this;
				return function(connect) {
					return latte_lib.promise.functionToPromise(self.count(g), connect);
				}
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);