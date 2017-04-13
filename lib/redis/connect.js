var Connect = function(client) {
	this.client = client;
	this.lastError = null;
	var self = this;
	client.on("error", function(err) {
		self.lastError = err;
		console.log(err);
	});
};
(function() {
	this.get = function(key, callback) {
		this.client.get(key, callback);
	}
	this.getPromise = function(key) {
		return latte_lib.promise.functionToPromise(this.get.bind(this), key);
	}
	this.set = function(key, value) {
		this.client.set(key, value, callback);
	}
	this.setPromise = function(key, value) {
		return latte_lib.promise.functionToPromise(this.get.bind(this), key, value);
	}
	this.close = function() {
		this.client.quit();
	}
	this.validate = function() {
		return this.client && this.client.stream && this.client.stream._connecting;
	}
}).call(Connect.prototype);
module.exports = Connect;