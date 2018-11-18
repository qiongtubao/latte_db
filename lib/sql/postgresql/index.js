"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = require("./pool");
var dao_1 = require("../../utils/dao");
exports.default = {
    create: function (config) {
        return new dao_1.Dao(pool_1.createPool, config);
    }
};
