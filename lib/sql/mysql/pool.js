"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2");
var connect_1 = require("./connect");
var pool_1 = require("../../utils/pool");
function createPool(config) {
    var logger = config.log || console;
    var p = pool_1.Pool.create({
        name: "mysql",
        validate: function (client) {
            return true;
        },
        create: function (callback) {
            var conn = mysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database,
                port: config.port || 3306,
            });
            var connect = new connect_1.default(conn);
            callback(connect);
        },
        destroy: function (client) {
            client.close();
        },
        max: config.maxPoolNum || 1,
        idleTimeoutMills: config.idleTimeoutMills || 3000,
        min: config.minPoolNum || 1,
    });
    process.on("exit", function () {
        p.destroyAllNow();
    });
    return p;
}
exports.createPool = createPool;
