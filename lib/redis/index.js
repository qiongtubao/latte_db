"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dao_1 = require("../utils/dao");
var hashClass = require("./class/hash");
var pool_1 = require("./pool");
var listClass = require("./class/list");
var setClass = require("./class/set");
exports.types = {
    Hash: hashClass,
    List: listClass,
    Set: setClass
};
function createClass(config) {
    if (!exports.types[config.type]) {
        console.error("no find ", config.type, "type");
        return null;
    }
    return exports.types[config.type].create(config.key, config.verify);
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
