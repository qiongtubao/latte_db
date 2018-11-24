"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var DataClass = /** @class */ (function () {
    function DataClass(key) {
    }
    __decorate([
        value()
    ], DataClass.prototype, "name");
    DataClass = __decorate([
        SortedSet(),
        RedisClass
    ], DataClass);
    return DataClass;
}());
exports.DataClass = DataClass;
latte_db.redis.sortedSet.add();
var latte_db = require("../../../index");
var db = latte_db["default"].redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
var c = new DataClass("hello");
var o = c.create({
    name: "dong",
    age: 12
});
db.getConnect(function (err, connect) {
    if (err) {
        return console.log(err);
    }
    c.push(o)(connect, function (error, data) {
        console.log(err, data);
    });
});
