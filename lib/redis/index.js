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
	var HashClass = require("./template/hash");
	var StringClass = require("./template/string");
	var ListClass = require("./template/list");
	var SetClass = require("./template/set");
	var SortedSetClass = require("./template/sortedSet");
	this.createHashClass = HashClass.create;
	this.createStringClass = StringClass.create;
	this.createListClass = ListClass.create;
	this.createSetClass = SetClass.create;
	this.createSortedSetClass = SortedSetClass.create;
}).call(module.exports);