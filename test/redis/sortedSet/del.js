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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var baseClass_1 = require("../../../lib/redis/baseClass");
var sortedSet_1 = require("../../../lib/redis/class/sortedSet");
var MSortSet = /** @class */ (function (_super) {
    __extends(MSortSet, _super);
    function MSortSet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = "sortedSet";
        return _this;
    }
    __decorate([
        baseClass_1.VerifyProperty({
            type: "string"
        })
    ], MSortSet.prototype, "name");
    __decorate([
        baseClass_1.VerifyProperty({
            type: "number"
        })
    ], MSortSet.prototype, "age");
    MSortSet = __decorate([
        baseClass_1.RedisClass()
    ], MSortSet);
    return MSortSet;
}(sortedSet_1.SortedSet));
var sortSet = new MSortSet();
var index_1 = require("../../../lib/index");
var db = index_1.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
db.getConnect(function (err, connect) {
    if (err) {
        return console.log(err);
    }
    sortSet.delAll()(connect, function (error, result) {
        console.log(error, result);
    });
});
