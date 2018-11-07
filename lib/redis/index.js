"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../utils/dao");
var hash_1 = require("./class/hash");
var pool_1 = require("./pool");
var list_1 = require("./class/list");
var types = {
    hash: hash_1.create,
    list: list_1.default
};
function createClass(config) {
    if (!types[config.type]) {
        console.error("no find ", config.type, "type");
        return null;
    }
    return types[config.type].create(config.key, config.verify);
}
exports.createClass = createClass;
var redis = {};
function bindDB(name, config) {
    var result = createDB(config);
    if (!result) {
        return result;
    }
    redis[name] = result;
    return result;
}
exports.bindDB = bindDB;
function createDB(config) {
    var db = new dao_1.Dao(pool_1.createPool, config);
    return db;
}
exports.createDB = createDB;
function getDB(name) {
    return redis[name];
}
exports.getDB = getDB;
