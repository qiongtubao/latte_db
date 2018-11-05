import * as sqlite3 from 'sqlite3'
let SQLite3 = sqlite3.verbose();
import Sqlite3Connect from './connect'
import { Pool } from '../../utils/pool'
import { SQLCOnfig } from '../config'
export function createPool(config: SQLCOnfig) {
  let logger = config.log || console;
  var p = Pool.create({
    name: "sqlite3",
    validate: function (connect) {
      return true;
    },
    create: function (callback) {
      let conn = new SQLite3.Database(config.database, (err) => {
        if (err) {
          console.log('open sqlite3 Database error');
        } else {
          console.log('open sqlite3 ok');
        }
      });
      let connect: Sqlite3Connect = new Sqlite3Connect(conn);
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