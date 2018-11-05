"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var connect_1 = require("../connect");
var utils = require("../utils");
var Sqlite3Connect = (function (_super) {
    __extends(Sqlite3Connect, _super);
    function Sqlite3Connect(connect) {
        var _this = _super.call(this, connect) || this;
        _this.sql = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.connect).exec.apply(_a, args);
            var _a;
        };
        _this.begin = function (callback) {
            _this.connect.exec("BEGIN TRANSACTION", callback);
        };
        _this.commit = function (callback) {
            _this.connect.exec("COMMIT TRANSACTION", callback);
        };
        _this.rollback = function (callback) {
            _this.connect.exec("ROLLBACK TRANSACTION", callback);
        };
        _this.count = function (tableName, wheres, options, callback) {
            var sql = utils.countSql(tableName, wheres, options);
            console.log(sql);
            _this.connect.all(sql, callback);
        };
        _this.query = function (tableName, wheres, options, callback) {
            var sql = utils.querySql(tableName, wheres, options);
            _this.connect.all(sql, callback);
        };
        _this.add = function (tableName, prototypes, callback) {
            var sql = utils.insertSql(tableName, prototypes);
            console.log(sql);
            _this.connect.run(sql, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(err, this);
            });
        };
        _this.close = function () {
            _this.connect.close();
        };
        _this.addKey = function (key, glassObject, result0, result1) {
            glassObject.set(key, result0.lastID);
            glassObject.flush();
        };
        return _this;
    }
    return Sqlite3Connect;
}(connect_1.default));
exports.default = Sqlite3Connect;
