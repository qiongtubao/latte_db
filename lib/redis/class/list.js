"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var latte_verify = require("latte_verify");
function toValue(v) {
    if (latte_lib.utils.isObject(v)) {
        return JSON.stringify(v);
    }
    else if (latte_lib.object.isLatteObject(v)) {
        return JSON.stringify(v);
    }
    else {
        return v;
    }
}
exports.toValue = toValue;
function create(key, config) {
    return (function () {
        function List(value) {
            try {
                value = latte_verify.verify(value, config);
            }
            catch (err) {
                console.log("list object verify Error", err);
                return null;
            }
            this.data = value;
            this._data = latte_lib.clone(value);
        }
        List.prototype.set = function (value) {
            try {
                value = latte_verify.verify(value, config);
            }
            catch (err) {
                console.log("list object verify Error", err);
                return null;
            }
            this.data = value;
        };
        List.prototype.get = function () {
            return this.data;
        };
        List.prototype.flush = function () {
            this._data = latte_lib.utils.clone(this.data);
        };
        List.prototype.toJSON = function () {
            return this.data.toJSON();
        };
        List.push = function (list) {
            return function (connect, callback) {
                connect.rpush(key, toValue(list.data), function (err, result) {
                    if (err) {
                        return callback(err);
                    }
                    if (result == 0) {
                    }
                    return callback(null, list);
                });
            };
        };
        List.size = function () {
            return function (connect, callback) {
                connect.llen(key, callback);
            };
        };
        List.unshift = function (list) {
            return function (connect, callback) {
                connect.lpush(key, toValue(list.data), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                    }
                    return callback(null, list);
                });
            };
        };
        List.shift = function () {
            return function (connect, callback) {
                connect.lpop(key, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data) {
                        var g = new List(data);
                        return callback(null, g);
                    }
                    else {
                        return callback();
                    }
                });
            };
        };
        List.pop = function () {
            return function (connect, callback) {
                connect.rpop(key, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data) {
                        var g = new List(data);
                        return callback(null, g);
                    }
                    else {
                        return callback();
                    }
                });
            };
        };
        List.waitShift = function () {
            return function (connect, callback) {
                connect.blpop([key], 0, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data[1]);
                    callback(null, g);
                });
            };
        };
        List.waitPop = function () {
            return function (connect, callback) {
                connect.brpop([key], 0, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data[1]);
                    callback(null, g);
                });
            };
        };
        List.getAll = function (min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = -1; }
            return function (connect, callback) {
                connect.lrange(key, min, max, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, data.map(function (o) {
                        return new List(o);
                    }));
                });
            };
        };
        List.create = function (value) {
            return new List(value);
        };
        List.get = function (index) {
            return function (connect, callback) {
                connect.lindex(key, index, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data);
                    callback(null, g);
                });
            };
        };
        List.set = function (index, list) {
            return function (connect, callback) {
                connect.lset(key, index, toValue(list.data), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                    }
                    callback(null, list);
                });
            };
        };
        List.del = function (list, index) {
            if (index === void 0) { index = 1; }
            return function (connect, callback) {
                connect.lrem(key, 1, toValue(list.data), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                    }
                    callback(null, data);
                });
            };
        };
        List.delAll = function () {
            return function (connect, callback) {
                connect.del(key, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                    }
                    callback(null, data);
                });
            };
        };
        return List;
    }());
}
exports.default = create;
