(function(define) { 'use strict';
	define("latte_db/pool", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("latte_lib");
		var RemoveIdle = latte_lib.removeIdle;
		var Queue = latte_lib.queue;
		function Pool(config) {
			this.count = 0;
			this.waitingClients = new Queue();
			this.draining =false;
			RemoveIdle.call(this, config);
			this.validate = config.validate || function(){return true;}
			this.validateDelete = config.validateDelete || function(){return true;}
			this.ensureMinimum();
		};	
		latte_lib.inherits(Pool, RemoveIdle);
		(function() {
			this.destroy = function(obj) {
				this.count--;
				RemoveIdle.prototype.destroy.call(this, obj);
			}
			this.dispense = function() {
				var self = this
					, obj = null
					, objWithTimeout = null
					, err = null
					, clientCb = null
					, waitingCount = this.waitingClients.size();
				if(waitingCount > 0) {
					while(this.availableObjects.length > 0) {
						objWithTimeout = this.availableObjects[0];
						if(!this.validateDelete(objWithTimeout.obj)) {
							this.destroy(objWithTimeout.obj);
							continue;
						}
						if(!this.validate(objWithTimeout.obj)) {
							this.destroy(objWithTimeout.obj);
							continue;
							// var object = this.availableObjects.shift();
							// this.availableObjects.push(object);
							// continue;
						}
						this.availableObjects.shift();
						clientCb = this.waitingClients.dequeue();
						if(!clientCb) {
							self.release(objWithTimeout.obj);
							return;
						}
						return clientCb(err , objWithTimeout.obj);
					}
					if(this.count < this.max) {
						this.createResource();
					}
				}
			}
			this.createResource = function() {
				this.count += 1;
				var self = this;
				self._create(function() {
					var err, obj;
					//var clientCb = self.waitingClients.dequeue();
					if(arguments.length > 1) {
						err = arguments[0];
        				obj = arguments[1];
					} else {
						err = (arguments[0] instanceof Error) ? arguments[0] : null;
        				obj = (arguments[0] instanceof Error) ? null : arguments[0];
					}
					if(err) {
						self.count -= 1;
						console.log(err);
						/*if(clientCb) {
							clientCb(err, obj);
						}*/
					} else {				
						self.release(obj);
						//latte_lib.nextTick(function() {
							self.dispense();
						//});
					}
				});
			}
			this.ensureMinimum = function() {
				var i, diff;
				if (!this.draining && (this.count < this.min)) {
					diff = this.min - this.count;
					for (i = 0; i < diff; i++) {
						this.createResource();
					}
				}
			}
			this.acquire = function(callback, priority) {
				if(this.draining) {
					throw new Error("pool is draining and cannot accept work");
				}
				if(!(typeof callback == "function")) {
					console.log(callback);
					throw new Error("callback no function");
				}
				this.waitingClients.enqueue(callback, priority);
				this.dispense();
				return (this.count < this.max);
			}
		}).call(Pool.prototype);
		module.exports.Pool = Pool;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });