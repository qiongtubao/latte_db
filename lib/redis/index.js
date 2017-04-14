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
	var StringClass = require("./glass/string");
	var ListClass = require("./glass/list");
	var SetClass = require("./glass/set");
	var SortedSetClass = require("./glass/sortedSet");
	this.createHashClass = HashClass.create;
	this.createStringClass = StringClass.create;
	this.createListClass = ListClass.create;
	this.createSetClass = SetClass.create;
	this.createSortedSetClass = SortedSetClass.create;
}).call(module.exports);