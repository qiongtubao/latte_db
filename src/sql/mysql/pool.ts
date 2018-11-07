import * as mysql from 'mysql2'
import Connect from './connect'
import { Pool } from '../../utils/pool'
import { SQLCOnfig } from '../config'


export function createPool(config: SQLCOnfig) {
  let logger = config.log || console;
  var p = Pool.create({
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
      var connect = new Connect(conn);
      callback(connect);
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