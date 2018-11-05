import * as sqlite3 from 'sqlite3'
import * as redis from "redis"
import RedisConnect from './connect'
import { Pool } from '../utils/pool'
interface Config {
  log: Function;
  port: number;
  host: string;
  password: string;
  database: number;
  maxPoolNum: number;
  idleTimeoutMills: number;
  minPoolNum: number;
}
export function createPool(redisConfig: Config) {
  let logger = redisConfig.log || console.log;
  var p = Pool.create({
    name: "redis",
    validate: function (connect: RedisConnect) {
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
      var connect = new RedisConnect(client);
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