(function() {
	var _self = this;
	var sqls = {

	};
	var Dao = require("../dao");
	this.bindDb = function(name, config) {
		_self[name] = Dao.create(_self.create(config), config);
		return _self;
	}
	this.create = function(config) {
		var Handle;
	
		if ( config.type ) {
			//try {
				Handle = require("./" + config.type + "/pool.js");
			//}catch (error) {
			//	console.log(error.stack.toString());
			//	throw (new Error("sql " + config.type + "config error:" ))
			//}
		}
		return Handle;
	}
	var templateClass = require("./templateClass");
	this.createClass = templateClass.create;
}).call(module.exports);