"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseClass_1 = require("../baseClass");
var List = (function () {
    function List() {
    }
    List.prototype.push = function (g) {
        var _this = this;
        return function (connect, callback) {
            connect.rpush(_this.key, g.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(null, g);
            });
        };
    };
    List.prototype.size = function () {
        var _this = this;
        return function (connect, callback) {
            connect.llen(_this.key, callback);
        };
    };
    List.prototype.unshift = function (list) {
        var _this = this;
        return function (connect, callback) {
            connect.lpush(_this.key, list.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                }
                return callback(null, list);
            });
        };
    };
    List.prototype.shift = function () {
        var _this = this;
        return function (connect, callback) {
            connect.lpop(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var listObject = _this.create(_this.verifyObject);
                return callback(null, listObject);
            });
        };
    };
    List.prototype.pop = function () {
        var _this = this;
        return function (connect, callback) {
            connect.rpop(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(null, _this.create(data));
            });
        };
    };
    List.prototype.waitShift = function () {
        var _this = this;
        return function (connect, callback) {
            connect.blpop([_this.key], 0, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var g = _this.create(data);
                callback(null, g);
            });
        };
    };
    List.prototype.waitPop = function () {
        var _this = this;
        return function (connect, callback) {
            connect.brpop([_this.key], 0, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var g = _this.create(data);
                callback(null, g);
            });
        };
    };
    List.prototype.getAll = function (min, max) {
        var _this = this;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = -1; }
        return function (connect, callback) {
            connect.lrange(_this.key, min, max, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data.map(function (o) {
                    return _this.create(o);
                }));
            });
        };
    };
    List.prototype.create = function (value) {
        var base = new baseClass_1.BaseObject(this.verifyObject);
        if (!base.set(value)) {
            return null;
        }
        else {
            return base;
        }
    };
    List.prototype.get = function (index) {
        var _this = this;
        return function (connect, callback) {
            connect.lindex(_this.key, index, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, _this.create(data));
            });
        };
    };
    List.prototype.set = function (index, list) {
        var _this = this;
        return function (connect, callback) {
            connect.lset(_this.key, index, list.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                }
                callback(null, list);
            });
        };
    };
    List.prototype.del = function (list, index) {
        var _this = this;
        if (index === void 0) { index = 1; }
        return function (connect, callback) {
            connect.lrem(_this.key, 1, list.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                }
                callback(null, data);
            });
        };
    };
    List.prototype.delAll = function () {
        var _this = this;
        return function (connect, callback) {
            connect.del(_this.key, function (err, data) {
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
exports.List = List;
