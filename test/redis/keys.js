"use strict";
exports.__esModule = true;
var latte_db = require("../../index");
var db = latte_db["default"].redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    connect.keys("*", (err, data) => {
        console.log("gets", err, data);
    });
});
