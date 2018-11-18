"use strict";
exports.__esModule = true;
var latte_db = require("../../../index");
var db = latte_db["default"].redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
var c = latte_db["default"].redis.createClass({
    type: "list",
    key: "students",
    verify: {
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength: 1
            },
            age: {
                type: "integer",
                min: 0
            }
        }
    }
});
db.getConnect(function (err, connect) {
    if (err) {
        return console.log(err);
    }
    c.delAll()(connect, function (error, result) {
        console.log(error, result);
    });
});
