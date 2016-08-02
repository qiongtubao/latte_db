(function() {
	var _self = this;	
	var getValue =this.getValue = function(value) {
		switch(latte_lib.getClassName(value)) {
			case "number":
				return value; 
			break;
			case "boolean":
				return (value? 1: 0);
			break;
			default:
				return JSON.stringify(value);
			break;
		}
	}
	var latte_lib = require("latte_lib");

	var createTableString = "create table if not exists {{table}} ({{tableData}})";
	this.createTableString = function(table, object) {
		return latte_lib.format.templateStringFormat(createTableString, {
			table: table,
			tableData: Object.keys(object).map(function(key) {
					return key + " "+ object[key];
			}).join(",")
		})
	}
	var deleteTableString = "drop table if exists {{table}}";
	this.deleteTableString = function(table) {
		return latte_lib.format.templateStringFormat(deleteTableString, {
			table: table
		});
	}
	var insertString = "insert into {{table}} {{keys}} values {{values}}"
	this.insertString = function( table, object) {
		return latte_lib.format.templateStringFormat(insertString, {
			table: table,
			keys: "("+Object.keys(object).join(",")+")",
			values: "("+Object.values(object).join(",")+")"
		});	
	}
		var getQueryValue = function(values) {
			return values != null? Object.keys(values).map(function(key) { return key + "=" + getValue(values[key]);}).join(" and "): null;
		}
	var allQueryString = "select {{keys}} from {{table}}";
	var queryString= "select {{keys}} from {{table}} where {{querys}}";
	this.queryString = function(table, querys, keys) {
		if(!keys) {
			keys = querys;
			querys = null;
		}
		console.log(table, querys, keys);
		var str = latte_lib.format.templateStringFormat(querys? queryString: allQueryString, {
			table: table,
			keys: latte_lib.isArray(keys)? keys.join(","): keys,
			querys: getQueryValue(querys)
		});
		console.log(str);
		return str;
	}
	var updateString = "update  {{table}} set {{sets}} where {{querys}}"
	this.updateString =  function( table, querys, sets) {
		return latte_lib.format.templateStringFormat(updateString, {
			table: table,
			sets: Object.keys(sets).map(function(key){ return key + " = "+ getValue(sets[key]); }).join(","),
			querys:  getQueryValue(querys)
		});
	}
	var deleteString = "delete from table where {{querys}}";
	this.deleteString = function( table, querys) {
		return latte_lib.format.templateStringFormat(deleteString,{
			table: table,
			querys: getQueryValue(querys)
		});
	}
}).call(module.exports);