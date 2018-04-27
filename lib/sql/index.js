"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./mysql/index");
var templateClass_1 = require("./templateClass");
var sqlTypes = {
    mysql: index_1.default
};
function create(config) {
    if (!sqlTypes[config.type]) {
        console.error("no find ", config.type, "type");
        return null;
    }
    return sqlTypes[config.type].create(config);
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
