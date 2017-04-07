	var latte_lib = require('latte_lib');
	var Connection = function(connect) {
		this.connect = connect;
	};
	(function() {
		this.sql = function() {
			throw new Error("so sorry");
		}
			function valueToString(value) {
			    if (latte_lib.isString(value)) {
			        //当json转换成对象的时候会出现"   所以最外层设置为'
			        return '\'' + value + '\'';
			    }else if(latte_lib.isObject(value)) {
			    	return "'" + JSON.stringify(value) + "'";
			    }else if(latte_lib.object.isLatteObject(value)) {
			    	return "'" + JSON.stringify(value) + "'";
			    }
			    return value;
			}
			var whereSql = function (wheres) {
				if(!wheres) {
					return "";
				}
				var keys = Object.keys(wheres);
				if(keys.length == 0) {
					return "";
				}
		        var wheresArray = [];
		        Object.keys(wheres).forEach(function (key) {
		            if (key[0] == '$') {
		                return;
		            }
		            if (wheres[key] != null && wheres[key] != '') {
		                if (Array.isArray(wheres[key])) {

		                    var orArrays = [];
		                    wheres[key].forEach(function (value, index) {
		                        if (value) {
		                            orArrays.push(key + ' = ' + valueToString(value));
		                        }
		                    });
		                    wheresArray.push('(' + orArrays.join(' or ') + ')');


		                } else {
		                    wheresArray.push(key + ' = ' + valueToString(wheres[key]));
		                }
		            }

		        });

		        if (wheres.$or) {
		            var orArrays = [];
		            Object.keys(wheres.$or).forEach(function (key, index) {
		                var value = wheres.$or[key];
		                if (typeof value == 'object') {
		                    orArrays.push('(' + whereSql(value) + ')');
		                } else {
		                    orArrays.push(key + '=' + value);
		                }

		            });
		            wheresArray.push('(' + orArrays.join(' or ') + ')');
		        }
		        return ' where ' + wheresArray.join(' and ');
		    }
			var querySql = function(tableName, wheres, options) {

				var prototypesStr;
		        if (options) {
		            if (options.projection) {
		                prototypesStr = Object.keys(options.projection).join(',') || '*';
		            } else {
		                prototypesStr = '*';
		            }

		        } else {
		            prototypesStr = '*';
		        }

		        if (wheres) {
		            var wheresStr = whereSql(wheres);
		            if (options && options.limit && options.limit.length == 2) {
		                var limits = options.limit.join(',');
		                return `select ${prototypesStr} from ${tableName} ${wheresStr} limit ${limits} ;`;
		            } else {
		                return `select ${prototypesStr} from ${tableName} ${wheresStr} ;`;
		            }

		        } else {
		            return `select ${prototypesStr} from ${tableName} ;`;
		        }
			}
		this.query = function(tableName, wheres, options, callback) {
			var sql = querySql(tableName, wheres, options);
			this.sql(sql, callback);
		}
			var updateSql = function(tableName, sets, wheres) {
				var setsArray = [];
		        Object.keys(sets).forEach(function (key) {
		            if (sets[key] != null && sets[key] != '') {
		                setsArray.push(key + ' = ' + valueToString(sets[key]));
		            }
		        });
		        const setsStr = setsArray.join(',');
		        if (wheres) {
		            var wheresStr = whereSql(wheres);
		            return `update ${tableName} set ${setsStr} ${wheresStr}`;
		        } else {
		            return `update ${tableName} set ${setsStr}`;
		        }
			}
		this.update = function(tableName, sets, wheres, callback) {
			var sql = updateSql(tableName, sets, wheres);
			this.sql(sql, callback);
		}
			var insertSql = function(tableName, prototypes) {
				var keysArray = [];
		        var valuesArray = [];
		        Object.keys(prototypes).forEach(function (key) {
		            if (prototypes[key] != null && prototypes[key] != '') {
		                keysArray.push(key);
		                valuesArray.push(valueToString(prototypes[key]));
		            }
		        });
		        const prototypesStr = keysArray.join(',');
		        const valuesStr = valuesArray.join(',');
        		return `insert into ${tableName} (${prototypesStr}) values (${valuesStr}) `;
			}
		this.add = function(tableName, prototypes, callback) {
			var sql = insertSql(tableName, prototypes);
			this.sql(sql, callback);
		}
			var delSql = function(tableName, wheres) {
				if (wheres) {
		            const wheresStr = whereSql(wheres);
		            return `delete from ${tableName} ${wheresStr}`
		        } else {
		            return `delete from ${tableName} `;
		        }
			}
		this.del = function(tableName, wheres, callback) {
			var sql = delSql(tableName, wheres);
			this.sql(sql, callback);
		}
			var countSql = function(tableName, wheres, options) {
				var prototypesStr;
		        if (options) {
		            prototypesStr = '1' || '*';
		        } else {
		            prototypesStr = '*';
		        }

		        if (wheres) {

		            const wheresStr = whereSql(wheres);
		            return `select count(${prototypesStr}) from ${tableName} ${wheresStr}`;


		        } else {
		            return `select count(${prototypesStr}) from ${tableName}`;
		        }
			}
		this.count = function(tableName, wheres, options, callback) {
			var sql = countSql(tableName, prototypes);
			this.sql(sql, callback);
		}
	}).call(Connection.prototype);
	module.exports = Connection;