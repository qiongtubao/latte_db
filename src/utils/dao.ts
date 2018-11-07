import { Pool, Config as PoolConfig } from "./pool"
import * as latte_lib from 'latte_lib'
export class Dao {
  pool: Pool;
  config: PoolConfig;
  log: Function;
  constructor(poolFunc: Function, config) {
    this.config = config;
    this.pool = poolFunc(config);
    this.log = config.log || function () { };
  }
  quit(callback?: () => void) {
    this.pool.destroyAllNow(callback);
  }
  back(client) {
    this.pool.release(client);
  }

  getConnect(callback?: (err, client) => void) {
    if (!latte_lib.utils.isFunction(callback)) {
      return;
    }
    const self = this;
    this.pool.acquire((error, client) => {
      if (!!error) {
        self.log(" getConnect err cycle:", error);
        return self.getConnect(callback);
      }
      callback(error, client);
    });
  }
  getConnectPromise(...args) {
    return latte_lib['promise'].promisify(this.getConnect.bind(this))(...args);
  };
  info = () => {
    return {
      name: this.pool.config.name,
      poolSize: this.pool.getSize(),
      availableObjectsCount: this.pool.availableObjects.length,
      waitingClientsCount: this.pool.availableObjects.length
    };
  }
  getDb = () => {
    return this.config.database;
  }
}