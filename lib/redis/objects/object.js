"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var RedisObject = (function () {
    function RedisObject(key, value, verifyObject) {
        try {
            value = this.verifyObject.verify(value);
        }
        catch (err) {
            console.warn("string set error");
            return;
        }
        this.key = key;
        this.value = value;
        this._value = latte_lib.utils.copy(value);
    }
    RedisObject.prototype.set = function (value) {
        try {
            value = this.verifyObject.verify(value);
        }
        catch (err) {
            console.error(err);
            return;
        }
        this.value = value;
    };
    RedisObject.prototype.get = function () {
        return this.value;
    };
    RedisObject.prototype.flush = function () {
        this._value = this.value;
    };
    return RedisObject;
}());
exports.RedisObject = RedisObject;
