"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashObject = (function () {
    function HashObject(key, value) {
        this.key = key;
        this.value = value;
        this._value = value;
    }
    HashObject.prototype.getUpdates = function () {
    };
    HashObject.prototype.hasUpdate = function () {
        return JSON.stringify(this.value) == JSON.stringify(this._value);
    };
    HashObject.prototype.flush = function () {
        this._value = this.value;
    };
    HashObject.prototype.toJSON = function () {
        return this.value;
    };
    return HashObject;
}());
var Hash = (function () {
    function Hash() {
    }
    Hash.prototype.crate = function (key, value) {
        return new HashObject(key, value);
    };
    Hash.prototype.add = function (t) {
        return function (connect, callback) {
            if (callback === void 0) { callback = function (err, result) {
                if (result === void 0) { result = undefined; }
            }; }
            var v = {};
            var value = t.toJSON();
            for (var i in value) {
                v[i] = JSON.stringify(value[i]);
            }
            connect.hmset(t.key, v, callback);
        };
    };
    Hash.prototype.del = function (t) {
        return function (connect, callback) {
            if (callback === void 0) { callback = function (err, result) {
                if (result === void 0) { result = undefined; }
            }; }
            connect.del(t.key, callback);
        };
    };
    Hash.prototype.update = function (t) {
        return function (connect, callback) {
            if (callback === void 0) { callback = function (err, result) {
                if (result === void 0) { result = undefined; }
            }; }
            connect.hmset(t.key, t.getUpdates(), callback);
        };
    };
    Hash.prototype.get = function (key) {
        return function (connect, callback) {
            if (callback === void 0) { callback = function (err, result) {
                if (result === void 0) { result = undefined; }
            }; }
            console.log(this.verifyObject);
        };
    };
    Hash.prototype.keys = function (key) {
        return function (connect, callback) {
            if (callback === void 0) { callback = function (err, result) {
                if (result === void 0) { result = undefined; }
            }; }
            connect.keys(key, callback);
        };
    };
    return Hash;
}());
exports.Hash = Hash;
