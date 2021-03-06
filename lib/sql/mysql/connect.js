var latte_lib = require('latte_lib');
var parentClass = require('../connect');
var Connect = function(connect) {
	parentClass.call(this, connect);
};
latte_lib.extends(Connect, parentClass);
(function() {
	this.sql = function() {
		//Array.prototype.slice.call(arguments)
		latte_lib.debug.log(arguments);
		return this.connect.query.apply(this.connect, arguments);
	}

	this.beginTransactionPromise = this.beginPromise = function() {
		return latte_lib.promise.functionToPromise(this.begin.bind(this));
	}

	this.beginTransaction = this.begin = function(callback) {
		var self = this;

		return this.connect.beginTransaction(callback);
	}
	this.commit = function(callback) {
		return this.connect.commit(callback);
	}	
	this.rollback = function(callback) {
		return this.connect.rollback(callback);
	}
	this.rollbackPromise = function() {
		return latte_lib.promise.functionToPromise(this.rollback.bind(this));
	}
	this.commitPromise = function() {
		return latte_lib.promise.functionToPromise(this.commit.bind(this));
	}
	this.addKey = function(key, glassObject, result0, result1) {
		glassObject.set(key,  result0.insertId);
		glassObject.flush();
	}
	this.close = function() {
		this.connect.close();
	}
}).call(Connect.prototype);
module.exports = Connect;