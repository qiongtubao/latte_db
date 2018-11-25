"use strict";
exports.__esModule = true;
var index_1 = require("../../lib/index");
var db = index_1.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
db.getConnect(function (err, connect) {
    if (err) {
        return console.log(err);
    }
    connect.keys("*", function (err, data) {
        console.log(err, data);
    });
});
