"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_verify_1 = require("latte_verify");
var latte_lib = require("latte_lib");
function getObject(data) {
    var data1 = latte_lib.utils.copy(data);
    Object.keys(data1).forEach(function (key) {
        data1[key] = JSON.stringify(data1[key]);
    });
    return data1;
}
function create(config) {
    return (function () {
        function templateClass(key, data) {
            var _this = this;
            this.key = key;
            try {
                data = latte_verify_1.default.verify(data, config);
            }
            catch (e) {
                console.error('redis hash key');
            }
            this.data = latte_lib.object.create(data || {});
            this.updateData = latte_lib.object.create({});
            this.oldData = latte_lib.utils.copy(data) || {};
            this.data.on("change", function (key, value) {
                _this.updateData.set(key, value);
            });
        }
        templateClass.prototype.get = function (key) {
            return this.data.get(key);
        };
        templateClass.prototype.set = function (key, value) {
            if (key.indexOf('.') == -1) {
                try {
                    value = latte_verify_1.default.verify(value, config[key]);
                }
                catch (e) {
                    throw e;
                }
            }
            this.data.set(key, value);
        };
        templateClass.prototype.getUpdates = function () {
            return getObject(this.updateData);
        };
        templateClass.prototype.getAll = function () {
            return getObject(this.data);
        };
        templateClass.prototype.flush = function () {
            this.oldData = latte_lib.utils.copy(this.data.toJSON());
            this.updateData = latte_lib.object.create({});
        };
        templateClass.prototype.toJSON = function () {
            return this.data.toJSON();
        };
        templateClass.crate = function (key, value) {
            return new templateClass(key, value);
        };
        templateClass.add = function (t) {
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
        templateClass.del = function (t) {
            return function (connect, callback) {
                if (callback === void 0) { callback = function (err, result) {
                    if (result === void 0) { result = undefined; }
                }; }
                connect.del(t.key, callback);
            };
        };
        templateClass.update = function (t) {
            return function (connect, callback) {
                if (callback === void 0) { callback = function (err, result) {
                    if (result === void 0) { result = undefined; }
                }; }
                connect.hmset(t.key, t.getUpdates(), callback);
            };
        };
        templateClass.get = function (key) {
            return function (connect, callback) {
                if (callback === void 0) { callback = function (err, result) {
                    if (result === void 0) { result = undefined; }
                }; }
                connect.hmget(key, Object.keys(config), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new templateClass(key, data);
                    callback(null, g);
                });
            };
        };
        templateClass.keys = function (key) {
            return function (connect, callback) {
                if (callback === void 0) { callback = function (err, result) {
                    if (result === void 0) { result = undefined; }
                }; }
                connect.keys(key, callback);
            };
        };
        return templateClass;
    }());
}
exports.create = create;
