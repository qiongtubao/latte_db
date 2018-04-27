"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var latte_class_1 = require("latte_class");
var Pool = (function (_super) {
    __extends(Pool, _super);
    function Pool(config) {
        var _this = _super.call(this, config) || this;
        _this.getSize = function () {
            return _this.waitingClients.size();
        };
        _this.destroy = function (obj) {
            _this.count--;
            _super.prototype.destroy.call(_this, obj);
        };
        _this.dispense = function () {
            var self = _this, obj = null, objWithTimeout = null, err = null, clientCb = null, waitingCount = _this.waitingClients.size();
            if (waitingCount > 0) {
                while (_this.availableObjects.length > 0) {
                    objWithTimeout = _this.availableObjects[0];
                    if (!_this.validateDelete(objWithTimeout.obj)) {
                        _this.destroy(objWithTimeout.obj);
                        continue;
                    }
                    if (!_this.validate(objWithTimeout.obj)) {
                        _this.destroy(objWithTimeout.obj);
                        continue;
                    }
                    _this.availableObjects.shift();
                    clientCb = _this.waitingClients.dequeue();
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
                        };
                    }
                    else {
                        objWithTimeout.obj.release = objWithTimeout.obj.release || function () {
                            self.release(objWithTimeout.obj);
                        };
                    }
                    return clientCb(err, objWithTimeout.obj);
                }
                if (_this.count < _this.max) {
                    _this.createResource();
                }
            }
        };
        _this.createResource = function () {
            this.count += 1;
            var self = this;
            self._create(function () {
                var err, obj;
                if (arguments.length > 1) {
                    err = arguments[0];
                    obj = arguments[1];
                }
                else {
                    err = (arguments[0] instanceof Error) ? arguments[0] : null;
                    obj = (arguments[0] instanceof Error) ? null : arguments[0];
                }
                if (err) {
                    self.count -= 1;
                    self.logger.error(err);
                }
                else {
                    self.release(obj);
                    self.dispense();
                }
            });
        };
        _this.acquire = function (callback, priority) {
            if (this.draining) {
                throw new Error("pool is draining and cannot accept work");
            }
            if (!(typeof callback == "function")) {
                throw new Error("callback no function");
            }
            this.waitingClients.enqueue(callback, priority);
            this.dispense();
            return (this.count < this.max);
        };
        _this.ensureMinimum = function () {
            var i, diff;
            if (!this.draining && (this.count < this.min)) {
                diff = this.min - this.count;
                for (i = 0; i < diff; i++) {
                    this.createResource();
                }
            }
        };
        _this.count = 0;
        _this._create = config.create;
        _this.drainging = false;
        _this.waitingClients = new latte_class_1.Queue();
        _this.validate = config.validate || function () {
            return true;
        };
        _this.validateDelete = config.validateDelete || function () {
            return true;
        };
        _this.ensureMinimum();
        _this.runTimeout = config.runTimeout;
        return _this;
    }
    Pool.create = function (config) {
        return new Pool(config);
    };
    return Pool;
}(latte_class_1.RemoveIdle.RemoveIdle));
exports.Pool = Pool;
