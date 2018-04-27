"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("./utils");
var Connection = (function () {
    function Connection(connect) {
        var _this = this;
        this.query = function (tableName, wheres, options, callback) {
            var sql = utils.querySql(tableName, wheres, options);
            _this.sql(sql, callback);
        };
        this.update = function (tableName, sets, wheres, callback) {
            var sql = utils.updateSql(tableName, sets, wheres);
            _this.sql(sql, callback);
        };
        this.add = function (tableName, prototypes, callback) {
            var sql = utils.insertSql(tableName, prototypes);
            _this.sql(sql, callback);
        };
        this.del = function (tableName, wheres, callback) {
            var sql = utils.delSql(tableName, wheres);
            _this.sql(sql, callback);
        };
        this.count = function (tableName, wheres, options, callback) {
            var sql = utils.countSql(tableName, wheres, options);
            _this.sql(sql, callback);
        };
        this.connect = connect;
    }
    return Connection;
}());
exports.default = Connection;
