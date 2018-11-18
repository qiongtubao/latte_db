"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var connect_1 = require("./connect");
var pool_1 = require("../../utils/pool");
function createPool(config) {
    var logger = config.log || console;
    var p = pool_1.Pool.create({
        name: "postgresql",
        validate: function (client) {
            return true;
        },
        create: function (callback) {
            var url = "postgres://" + config.user + ":" + config.password + "@" + config.host + ":" + (config.port || 5432) + "/" + (config.database || 'postgres');
            var client = new pg_1.Client(url);
            client.connect(function (err) {
                if (err) {
                    console.error('postgresql 连接失败:', err);
                }
            });
            callback(new connect_1.default(client));
        },
        destroy: function (client) {
            client.close();
        },
        maxPoolNum: config.maxPoolNum || 1,
        idleTimeoutMills: config.idleTimeoutMills || 3000,
        minPoolNum: config.minPoolNum || 1,
    });
    process.on("exit", function () {
        p.destroyAllNow();
    });
    return p;
}
exports.createPool = createPool;
