"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_verify_1 = require("latte_verify");
var BaseObject = (function () {
    function BaseObject(key, verifyObject) {
        this.verifyObject = verifyObject;
    }
    BaseObject.prototype.setValue = function (data) {
        try {
            this.verifyObject.verify(data);
        }
        catch (err) {
            data = null;
        }
        if (data == null) {
            return false;
        }
        this.data = data;
        return true;
    };
    BaseObject.prototype.flush = function () {
        this._data = this.data;
    };
    BaseObject.prototype.hasUpdate = function () {
        return JSON.stringify(this._data) !== JSON.parse(this.data);
    };
    BaseObject.prototype.toString = function () {
        return JSON.stringify(this.data);
    };
    return BaseObject;
}());
var RedisString = (function () {
    function RedisString(key, config) {
        this.key = key;
        this.verifyObject = latte_verify_1.createVerify(config);
    }
    RedisString.prototype.add = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.set(_this.key, data.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.warn("redis string add ", data.key, "return 0");
                }
                return callback(err, data);
            });
        };
    };
    RedisString.prototype.update = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.set(_this.key, data.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.info("redis string update ", data.key, "return 0");
                }
                data.flush();
                return callback(err, data);
            });
        };
    };
    RedisString.prototype.del = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.del(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.info("redis string del ", data.key, "return 0");
                }
                return callback(err, data);
            });
        };
    };
    RedisString.prototype.query = function () {
        var _this = this;
        return function (connect, callback) {
            connect.get(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == null) {
                    console.info("redis string query ", _this.key, "return 0");
                }
                var g = _this.create(_this.verifyObject);
                if (g.setValue(data)) {
                    return callback(err, g);
                }
                else {
                    return callback(new Error("type error"));
                }
            });
        };
    };
    RedisString.prototype.create = function (value) {
        return new BaseObject(value, this.verifyObject);
    };
    return RedisString;
}());
exports.RedisString = RedisString;
function default_1(key, config) {
    var str = new RedisString(key, config);
    return str;
}
exports.default = default_1;
