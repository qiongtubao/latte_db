"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_verify_1 = require("latte_verify");
var latte_lib_1 = require("latte_lib");
exports.default = (function (tableName, config) {
    var uniques = {};
    var key;
    Object.keys(config).forEach(function (k) {
        if (config[k].key != null) {
            key = k;
        }
        if (config[k].unique != null) {
            uniques[config[k].unique] = uniques[config[k].unique] || [];
            uniques[config[k].unique].push(k);
        }
    });
    var getWhere = function (g) {
        return g.getWhere();
    };
    var isTemplateClass = function (obj) {
        return obj.constructor == templateClass;
    };
    var templateClass = (function () {
        function templateClass(data) {
            var _this = this;
            this.update = function (data) {
                var self = _this;
                Object.keys(data).forEach(function (k) {
                    self.set(k, data[key]);
                });
            };
            this.getWhere = function () {
                var result = {};
                if (_this.oldData[key]) {
                    result[key] = _this.oldData[key];
                    return result;
                }
                for (var i in uniques) {
                    var r = true;
                    for (var k = 0, len = uniques[i].length; k < len; k++) {
                        if (_this.oldData[uniques[i][k]] == undefined) {
                            r = false;
                            break;
                        }
                        else {
                            result[uniques[i][k]] = _this.oldData[uniques[i][k]];
                        }
                    }
                    if (r == true) {
                        return result;
                    }
                    else {
                        result = {};
                    }
                }
                return _this.oldData;
            };
            this.get = function (key) {
                return _this.data.get(key);
            };
            this.set = function (key, value) {
                if (key.indexOf('.') == -1) {
                    try {
                        value = latte_verify_1.default.verifyPrototype(value, config[key]);
                    }
                    catch (e) {
                        throw e;
                    }
                }
                return _this.data.set(key, value);
            };
            this.getUpdates = function () {
                return _this.updateData.toJSON();
            };
            this.flush = function () {
                _this.oldData = latte_lib_1.default.copy(_this.data.toJSON());
                _this.updateData = latte_lib_1.default.object.create({});
            };
            this.clean = function () {
                _this.data = latte_lib_1.default.object.create(latte_lib_1.default.copy(_this.oldData));
                _this.updateData = latte_lib_1.default.object.create({});
            };
            this.toJSON = function () {
                return _this.data.toJSON();
            };
            try {
                data = latte_verify_1.default.verify(data, {
                    type: "object",
                    properties: config
                });
            }
            catch (e) {
                console.log(e);
            }
            this.data = latte_lib_1.default.object.create(data || {});
            this.updateData = latte_lib_1.default.object.create({});
            this.oldData = latte_lib_1.default.copy(data) || {};
            var self = this;
            this.data.on("change", function (key, value) {
                self.updateData.set(key, value);
            });
        }
        templateClass.queryOne = function (wheres, options) {
            if (isTemplateClass(wheres)) {
                wheres = getWhere(wheres);
            }
            return function (connect, callback) {
                options = options || {};
                if (!latte_lib_1.default.isFunction(callback)) {
                    callback = function () { };
                }
                options.projection = options.projection || config;
                options.limie = [0, 1];
                connect.query(tableName, wheres, options, function (err, d) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, d[0] ? templateClass.create(d[0]) : null);
                });
            };
        };
        templateClass.create = function (data) {
            return new templateClass(latte_lib_1.default.copy(data));
        };
        templateClass.count = function (wheres) {
            if (isTemplateClass(wheres)) {
                wheres = getWhere(wheres);
            }
            return function (connect, callback) {
                if (!latte_lib_1.default.isFunction(callback)) {
                    callback = function () { };
                }
                connect.count(tableName, wheres, {}, function (err, result0, result1) {
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
        templateClass.countPromise = function (wheres) {
            return function (connect) {
                var func = templateClass.count(wheres);
                return latte_lib_1.default.promise.promisify(func)(connect);
            };
        };
        return templateClass;
    }());
    return templateClass;
});
