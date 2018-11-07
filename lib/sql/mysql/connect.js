"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var connect_1 = require("../connect");
var MySqlConnect = (function (_super) {
    __extends(MySqlConnect, _super);
    function MySqlConnect(connect) {
        var _this = _super.call(this, connect) || this;
        _this.sql = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            return (_a = _this.connect).query.apply(_a, args);
        };
        _this.begin = function (callback) {
            return _this.connect.beginTransaction(callback);
        };
        _this.commit = function (callback) {
            return _this.connect.commit(callback);
        };
        _this.rollback = function (callback) {
            return _this.connect.rollback(callback);
        };
        _this.close = function () {
            _this.connect.close();
        };
        _this.addKey = function (key, glassObject, result0, result1) {
            glassObject.set(key, result0.insertId);
            glassObject.flush();
        };
        return _this;
    }
    return MySqlConnect;
}(connect_1.default));
exports.default = MySqlConnect;
