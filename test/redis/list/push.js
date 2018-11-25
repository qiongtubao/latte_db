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
var latte_db = require("../../../lib/index");
var baseClass_1 = require("../../../lib/redis/baseClass");
var list_1 = require("../../../lib/redis/class/list");
var db = latte_db.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
// let c = latte_db.default.redis.createClass({
//     type: "list",
//     key: "students",
//     verify: {
//         type: "object",
//         properties: {
//             name: {
//                 type: "string",
//                 minLength: 1
//             },
//             age: {
//                 type: "integer",
//                 min: 0
//             }
//         }
//     }
// });
var MList = /** @class */ (function (_super) {
    __extends(MList, _super);
    function MList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = 'list';
        return _this;
    }
    __decorate([
        baseClass_1.VerifyProperty({
            type: "string"
        })
    ], MList.prototype, "name");
    __decorate([
        baseClass_1.VerifyProperty({
            type: "number"
        })
    ], MList.prototype, "age");
    MList = __decorate([
        baseClass_1.RedisClass
    ], MList);
    return MList;
}(list_1.List));
var c = new MList();
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
