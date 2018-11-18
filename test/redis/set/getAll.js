"use strict";
exports.__esModule = true;
var index_1 = require("../../../lib/index");
var db = index_1.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
var c = index_1.redis.types.Set.create('set', {
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
});
db.getConnect(function (err, connect) {
    if (err) {
        return console.log(err);
    }
    c.getAll()(connect, function (error, result) {
        console.log(error, result);
    });
});
