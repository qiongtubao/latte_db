"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var SQLite3 = sqlite3.verbose();
var connect_1 = require("./connect");
var pool_1 = require("../../utils/pool");
function createPool(config) {
    var logger = config.log || console;
    var p = pool_1.Pool.create({
        name: "sqlite3",
        validate: function (connect) {
            return true;
        },
        create: function (callback) {
            var conn = new SQLite3.Database(config.database, function (err) {
                if (err) {
                    console.log('open sqlite3 Database error');
                }
                else {
                    console.log('open sqlite3 ok');
                }
            });
            var connect = new connect_1.default(conn);
            callback(connect);
        },
        destroy: function (connect) {
            connect.close();
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
