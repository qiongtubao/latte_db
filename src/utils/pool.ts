

import { RemoveIdle, Queue } from 'latte_class'
import latte_lib from 'latte_lib'
export interface Config extends RemoveIdle.Config {
  database?: string;
  validate?: Function;
  name?: string;
  validateDelete?: Function;
  runTimeout?: number;
  minPoolNum?: number;
  maxPoolNum?: number;
  idleTimeoutMills?: number;
  create: Function;
}
export class Pool extends RemoveIdle.RemoveIdle {
  count: number;
  waitingClients: Queue;
  drainging: boolean;
  validate: Function;
  validateDelete: Function;
  runTimeout: number;
  config: Config;
  _create: Function;
  constructor(config: Config) {
    super(config);
    this.count = 0;
    this._create = config.create;
    this.drainging = false;
    this.waitingClients = new Queue();
    this.validate = config.validate || function () {
      return true;
    }
    this.validateDelete = config.validateDelete || function () {
      return true;
    }
    this.ensureMinimum();
    this.runTimeout = config.runTimeout;
  }
  getSize = (): number => {
    return this.waitingClients.size();
  }
  destroy = (obj): void => {
    this.count--;
    super.destroy(obj);
  }
  dispense = () => {
    let self = this
      , obj = null
      , objWithTimeout = null
      , err = null
      , clientCb = null
      , waitingCount = this.waitingClients.size();
    if (waitingCount > 0) {
      while (this.availableObjects.length > 0) {
        objWithTimeout = this.availableObjects[0];
        if (!this.validateDelete(objWithTimeout.obj)) {
          this.destroy(objWithTimeout.obj);
          continue;
        }
        if (!this.validate(objWithTimeout.obj)) {
          this.destroy(objWithTimeout.obj);
          continue;
        }
        this.availableObjects.shift();
        clientCb = this.waitingClients.dequeue();
        if (!clientCb) {
          self.release(objWithTimeout.obj);
          return;
        }
        if (self.runTimeout) {
          var timer = setTimeout(function () {
            console.warn("pool runTimeout:", clientCb.method);
          }, self.runTimeout);
          objWithTimeout.obj.release = function () {
            clearTimeout(timer);
            self.release(objWithTimeout.obj);
          }
        } else {
          objWithTimeout.obj.release = objWithTimeout.obj.release || function () {
            self.release(objWithTimeout.obj);
          }
        }
        return clientCb(err, objWithTimeout.obj);
      }
      if (this.count < this.max) {
        this.createResource();
      }
    }
  }
  createResource = function () {
    this.count += 1;
    let self = this;
    self._create(function () {
      var err, obj;
      if (arguments.length > 1) {
        err = arguments[0];
        obj = arguments[1];
      } else {
        err = (arguments[0] instanceof Error) ? arguments[0] : null;
        obj = (arguments[0] instanceof Error) ? null : arguments[0];
      }
      if (err) {
        self.count -= 1;
        self.logger.error(err);
      } else {
        self.release(obj);
        self.dispense();
      }
    });
  }
  acquire = function (callback, priority?) {
    if (this.draining) {
      throw new Error("pool is draining and cannot accept work");
    }
    if (!(typeof callback == "function")) {
      throw new Error("callback no function");
    }
    //callback.method = getMethod();
    this.waitingClients.enqueue(callback, priority);
    this.dispense();
    return (this.count < this.max);
  }
  ensureMinimum = function () {
    var i, diff;
    if (!this.draining && (this.count < this.min)) {
      diff = this.min - this.count;
      for (i = 0; i < diff; i++) {
        this.createResource();
      }
    }
  }
  static create(config: Config) {
    return new Pool(config);
  }
}