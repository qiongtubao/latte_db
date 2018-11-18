"use strict";
exports.__esModule = true;
var index_1 = require("../../../index");
var config = require("./db.json");
var db = index_1.sql.sqlTypes.postgresql.create(config);
var teacherClass = index_1.sql.createClass("teacher", {
    id: {
        type: "string",
        key: 1
    },
    name: {
        type: "string"
    },
    pwd: {
        type: "string"
    }
});
db.getConnect(function (err, connect) {
    teacherClass.del({
        id: "1"
    })(connect, function (err, data) {
        console.log(err, data);
    });
});
