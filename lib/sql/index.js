"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./mysql/index");
var index_2 = require("./sqlite3/index");
var templateClass_1 = require("./templateClass");
var index_3 = require("./postgresql/index");
exports.sqlTypes = {
    mysql: index_1.default,
    sqlite3: index_2.default,
    postgresql: index_3.default
};
function create(config) {
    if (!exports.sqlTypes[config.type]) {
        console.error("no find ", config.type, "type");
        return null;
    }
    return exports.sqlTypes[config.type].create(config);
}
exports.create = create;
var sqls = {};
function bindDB(name, config) {
    var result = create(config);
    if (!result) {
        return result;
    }
    sqls[name] = result;
    return result;
}
exports.bindDB = bindDB;
function getDB(name) {
    return sqls[name];
}
exports.getDB = getDB;
exports.createClass = templateClass_1.default;
