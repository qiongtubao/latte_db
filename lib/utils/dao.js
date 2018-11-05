"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib_1 = require("latte_lib");
var Dao = (function () {
    function Dao(poolFunc, config) {
        var _this = this;
        this.info = function () {
            return {
                name: _this.pool.config.name,
                poolSize: _this.pool.getSize(),
                availableObjectsCount: _this.pool.availableObjects.length,
                waitingClientsCount: _this.pool.availableObjects.length
            };
        };
        this.getDb = function () {
            return _this.config.database;
        };
        this.config = config;
        this.pool = poolFunc(config);
        this.log = config.log || function () { };
    }
    Dao.prototype.quit = function (callback) {
        this.pool.destroyAllNow(callback);
    };
    Dao.prototype.back = function (client) {
        this.pool.release(client);
    };
    Dao.prototype.getConnect = function (callback) {
        if (!latte_lib_1.default.isFunction(callback)) {
            return;
        }
        var self = this;
        this.pool.acquire(function (error, client) {
            if (!!error) {
                self.log(" getConnect err cycle:", error);
                return self.getConnect(callback);
            }
            callback(error, client);
        });
    };
    Dao.prototype.getConnectPromise = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return latte_lib_1.default['promise'].promisify(this.getConnect.bind(this)).apply(void 0, args);
    };
    ;
    return Dao;
}());
exports.Dao = Dao;
