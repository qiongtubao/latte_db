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
		var Handle = require("./pool.js");
		return Handle;
	}
	var HashClass = require("./glass/hash");
	this.createHashClass = HashClass.create;
}).call(module.exports);