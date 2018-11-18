"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_verify_1 = require("latte_verify");
var latte_lib = require("latte_lib");
var DataClass = (function () {
    function DataClass(config, data, options) {
        var _this = this;
        this.updateData = {};
        this.config = config;
        this.key = options.key;
        this.uniques = options.uniques;
        this.data = latte_lib.object.create(data || {});
        this.updateData = latte_lib.object.create({});
        this._data = latte_lib.utils.copy(data) || {};
        this.data.on("change", function (key, value) {
            _this.updateData.set(key, value);
        });
    }
    DataClass.prototype.getData = function () {
        return this.data.data;
    };
    DataClass.prototype.update = function (data) {
        for (var key in data) {
            this.data[key] = data[key];
        }
    };
    DataClass.prototype.getWhere = function () {
        var result = {};
        if (this._data[this.key]) {
            result[this.key] = this._data[this.key];
            return result;
        }
        for (var i in this.uniques) {
            var v = true;
            for (var k = 0, len = this.uniques[i].length; k < len; k++) {
                if (this._data[this.uniques[i][k]] == null) {
                    v = false;
                    break;
                }
                else {
                    result[this.uniques[i][k]] = this._data[this.uniques[i][k]];
                }
            }
            if (v == true) {
                return result;
            }
            else {
                result = {};
            }
        }
    };
    DataClass.prototype.get = function (key) {
        return this.data[key];
    };
    DataClass.prototype.set = function (key, value) {
        if (key.indexOf('.') == -1) {
            try {
                value = latte_verify_1.default.verify(value, this.config[key]);
            }
            catch (e) {
                throw e;
            }
        }
        this.data.set(key, value);
    };
    DataClass.prototype.getUpdates = function () {
        var _this = this;
        var result = {};
        Object.keys(this.updateData.data).forEach(function (key) {
            result[key] = _this.data.data[key];
        });
        return result;
    };
    DataClass.prototype.flush = function () {
        this._data = latte_lib.utils.copy(this.data.data);
        this.updateData = latte_lib.object.create({});
    };
    DataClass.prototype.toJSON = function () {
        return this.data.toJSON();
    };
    return DataClass;
}());
function isDataClass(obj) {
    return obj.constructor == DataClass;
}
var TemplateClass = (function () {
    function TemplateClass(name, config) {
        this.uniques = {};
        this.tableName = name;
        this.uniques = {};
        var key;
        for (var i in config) {
            if (config[i].key != null) {
                key = i;
            }
            if (config[i].unique != null) {
                this.uniques[config[i].unique] = this.uniques[config[i].unique] || [];
                this.uniques[config[i].unique].push(i);
            }
        }
        this.key = key;
        this.config = config;
    }
    TemplateClass.prototype.queryOnePromise = function (wheres, options) {
        var _this = this;
        return function (connect) {
            var func = _this.query(wheres, options);
            return latte_lib.promise.promisify(func)(connect);
        };
    };
    TemplateClass.prototype.queryOne = function (wheres, options) {
        var _this = this;
        if (isDataClass(wheres)) {
            wheres = wheres.toJSON();
        }
        return function (connect, callback) {
            options = options || {};
            if (!latte_lib.utils.isFunction(callback)) {
                console.warn("queryOne callback is not Function");
                callback = function () {
                };
            }
            options.projection = options.projection || _this.config;
            options.limie = [0, 1];
            connect.query(_this.tableName, wheres, options, function (err, d) {
                if (err) {
                    return callback(err);
                }
                callback(null, d[0] ? this.create(d[0]) : null);
            });
        };
    };
    TemplateClass.prototype.queryPromise = function (wheres, options) {
        var _this = this;
        return function (connect) {
            return latte_lib.promise.promisify(_this.query(wheres, options), connect);
        };
    };
    TemplateClass.prototype.query = function (wheres, options) {
        var _this = this;
        if (isDataClass(wheres)) {
            wheres = wheres.toJSON();
        }
        return function (connect, callback) {
            options = options || {};
            if (!latte_lib.utils.isFunction(callback)) {
                console.warn("query callback is not Function");
                callback = function () { };
            }
            options.projection = options.projection || _this.config;
            connect.query(_this.tableName, wheres, options, function (err, data) {
                if (err) {
                    return callback(err);
                }
                console.log(data);
                callback(null, connect.queryResultArray(data).map(function (d) {
                    return _this.create(d);
                }));
            });
        };
    };
    TemplateClass.prototype.updatePromise = function (wheres, update) {
        var _this = this;
        return function (connect) {
            var func = _this.update(wheres, update);
            return latte_lib.promise.promisify(func)(connect);
        };
    };
    TemplateClass.prototype.update = function (wheres, update) {
        var _this = this;
        var g;
        if (isDataClass(wheres)) {
            g = wheres;
            update = wheres.getUpdates();
            wheres = wheres.getWhere();
        }
        return function (connect, callback) {
            if (!latte_lib.utils.isFunction(callback)) {
                console.error("update callback is not Function");
                callback = function () { };
            }
            connect.update(_this.tableName, update, wheres, function (err, result0, result1) {
                g && g.flush();
                callback(err, wheres);
            });
        };
    };
    TemplateClass.prototype.delPromise = function (wheres) {
        var _this = this;
        return function (connect) {
            var func = _this.del(wheres);
            return latte_lib.promise.promisify(func)(connect);
        };
    };
    TemplateClass.prototype.del = function (wheres) {
        var _this = this;
        if (isDataClass(wheres)) {
            wheres = wheres.getWhere();
        }
        return function (connect, callback) {
            if (!latte_lib.utils.isFunction(callback)) {
                console.error("del callback is not Function");
                callback = function () { };
            }
            connect.del(_this.tableName, wheres, function (err, result0, result1) {
                console.log(result0, result1);
                callback(err, _this);
            });
        };
    };
    TemplateClass.prototype.addPromise = function (data) {
        var _this = this;
        return function (connect) {
            var func = _this.add(data);
            return latte_lib.promise.promisify(func)(connect);
        };
    };
    TemplateClass.prototype.add = function (data) {
        var _this = this;
        return function (connect, callback) {
            if (!latte_lib.utils.isFunction(callback)) {
                console.error("add callback is not Function");
                callback = function () { };
            }
            connect.add(_this.tableName, data.getData(), function (err, result0, result1) {
                if (err) {
                    return callback(err);
                }
                if (_this.config[_this.key].type == "integer") {
                    connect.addKey(_this.key, data, result0, result1);
                }
                callback(null, data);
            });
        };
    };
    TemplateClass.prototype.createTable = function (options) {
        var _this = this;
        return function (connect, callback) {
            connect.createTable(_this.tableName, _this.config, options, callback);
        };
    };
    TemplateClass.prototype.create = function (data) {
        return new DataClass(this.config, data, {
            key: this.key,
            uniques: this.uniques
        });
    };
    TemplateClass.prototype.countPromise = function (data) {
        var _this = this;
        return function (connect) {
            return latte_lib.promise.promisify(_this.count(data), connect);
        };
    };
    TemplateClass.prototype.count = function (wheres) {
        var _this = this;
        if (isDataClass(wheres)) {
            wheres = wheres.getWhere(wheres);
        }
        return function (connect, callback) {
            if (!latte_lib.utils.isFunction(callback)) {
                console.error("count callback is not Function");
                callback = function () { };
            }
            connect.count(_this.tableName, wheres, {}, function (err, result0, result1) {
                if (err) {
                    return callback(err);
                }
                if (result0[0] != null && result0[0]["count(1)"] != null) {
                    return callback(null, result0[0]["count(1)"]);
                }
                else {
                    callback(new Error("latte_db templateClass count has bug"));
                }
            });
        };
    };
    return TemplateClass;
}());
exports.default = (function (tableName, config) {
    var template = new TemplateClass(tableName, config);
    return template;
});
