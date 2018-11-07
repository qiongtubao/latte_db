"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var connect_1 = require("./connect");
var pool_1 = require("../utils/pool");
function createPool(redisConfig) {
    var logger = redisConfig.log || console.log;
    var p = pool_1.Pool.create({
        name: "redis",
        validate: function (connect) {
            return connect.validate();
        },
        create: function (callback) {
            var client = redis.createClient(redisConfig.port, redisConfig.host);
            redisConfig.password && client.auth((redisConfig.password || ""));
            if (redisConfig.database) {
                client.select(redisConfig.database, function (err, res) {
                    if (err) {
                        logger("select", redisConfig.database, "faild", err);
                        return;
                    }
                });
            }
            var connect = new connect_1.default(client);
            callback(null, connect);
        },
        destroy: function (connect) {
            connect.close();
        },
        max: redisConfig.maxPoolNum || 1,
        idleTimeoutMills: redisConfig.idleTimeoutMills || 3000,
        min: redisConfig.minPoolNum || 1,
    });
    process.on("exit", function () {
        p.destroyAllNow();
    });
    return p;
}
exports.createPool = createPool;
