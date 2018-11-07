"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQL = require("./sql/index");
var redis = require("./redis/index");
exports.default = {
    SQL: SQL,
    redis: redis
};
