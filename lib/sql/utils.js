"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib_1 = require("latte_lib");
var valueToString = function (value) {
    if (latte_lib_1.default.isString(value)) {
        return '\'' + value + '\'';
    }
    else if (latte_lib_1.default.isDate(value)) {
        return value.getTime();
    }
    else if (latte_lib_1.default.isObject(value)) {
        return "'" + JSON.stringify(value) + "'";
    }
    else if (latte_lib_1.default.object.isLatteObject(value)) {
        return "'" + JSON.stringify(value) + "'";
    }
    return value;
};
var v2s = function (k, v) {
    var pindex = k.indexOf('.');
    var kindex = k.indexOf('[');
    var index;
    if (pindex == -1) {
        index = kindex;
    }
    else if (kindex == -1) {
        index = pindex;
    }
    else {
        index = Math.min(kindex, pindex);
    }
    var f = "";
    if (index != -1) {
        var jk = "$" + k.substring(index).split('.').map(function (a) {
            if (a == "") {
                return "";
            }
            else if (a.indexOf("[") == 0) {
                return a;
            }
            else if (a.indexOf('"') != 0) {
                var akIndex = a.indexOf('[');
                if (akIndex == -1) {
                    return '"' + a + +'"';
                }
                else {
                    return '"' + a.substring(0, akIndex) + '"' + a.substring(akIndex);
                }
            }
            else {
                return a;
            }
        }).join(".");
        k = k.substring(0, index);
        if (v.$gt != null || v.$lt != null || v.$gte != null || v.$lte != null || v.$like != null) {
            var array = [];
            if (v.$gt != null) {
                array.push(k + "->'" + jk + "' > " + valueToString(v.$gt));
            }
            if (v.$lt != null) {
                array.push(k + "->'" + jk + "' < " + valueToString(v.$lt));
            }
            if (v.$gte != null) {
                array.push(k + "->'" + jk + "' >= " + valueToString(v.$gte));
            }
            if (v.$lte != null) {
                array.push(k + "->'" + jk + "' <= " + valueToString(v.$lte));
            }
            if (v.$like != null) {
                array.push(k + "->'" + jk + "' like " + valueToString(v.$like));
            }
            return "(" + array.join(" and ") + ")";
        }
        else {
            return k + "->'" + jk + "'=" + valueToString(v);
        }
    }
    else {
        if (v.$gt != null || v.$lt != null || v.$gte != null || v.$lte != null || v.$like != null) {
            var array = [];
            if (v.$gt != null) {
                array.push(k + " > " + valueToString(v.$gt));
            }
            if (v.$lt != null) {
                array.push(k + " < " + valueToString(v.$lt));
            }
            if (v.$gte != null) {
                array.push(k + " >= " + valueToString(v.$gte));
            }
            if (v.$lte != null) {
                array.push(k + " <= " + valueToString(v.$lte));
            }
            if (v.$like != null) {
                array.push(k + " like " + valueToString(v.$like));
            }
            return "(" + array.join(" and ") + ")";
        }
        else {
            return k + " = " + valueToString(v);
        }
    }
};
var j2s = function (where) {
    var array = [];
    var _loop_1 = function (i) {
        var o = where[i];
        if (o.$or) {
            array.push("(" + o.$or.map(function (v) {
                return v2s(i, v);
            }).join(" or ") + ")");
        }
        else {
            array.push(v2s(i, o));
        }
    };
    for (var i in where) {
        _loop_1(i);
    }
    return "(" + array.join(" and ") + ")";
};
function whereSql(wheres) {
    if (!wheres) {
        return "";
    }
    var keys = Object.keys(wheres);
    if (keys.length == 0) {
        return "";
    }
    var whereStr = "where ";
    if (latte_lib_1.default.isObject(wheres)) {
        if (wheres.$or) {
            whereStr += wheres.$or.map(function (v) {
                return j2s(v);
            }).join(" or ");
        }
        else {
            whereStr += j2s(wheres);
        }
    }
    else if (latte_lib_1.default.isArray(wheres)) {
        whereStr += wheres.map(function (v) {
            return j2s(v);
        }).join(" and ");
    }
    return whereStr;
}
exports.whereSql = whereSql;
function querySql(tableName, wheres, options) {
    var prototypesStr;
    if (options) {
        if (options.projection) {
            prototypesStr = Object.keys(options.projection).join(',') || '*';
        }
        else {
            prototypesStr = '*';
        }
    }
    else {
        prototypesStr = '*';
    }
    if (wheres) {
        var wheresStr = whereSql(wheres);
        if (options && options.limit && options.limit.length == 2) {
            var limits = options.limit.join(',');
            return "select " + prototypesStr + " from " + tableName + " " + wheresStr + " limit " + limits + " ;";
        }
        else {
            return "select " + prototypesStr + " from " + tableName + " " + wheresStr + " ;";
        }
    }
    else {
        return "select " + prototypesStr + " from " + tableName + " ;";
    }
}
exports.querySql = querySql;
function updateSql(tableName, sets, wheres) {
    var setsArray = [];
    Object.keys(sets).forEach(function (key) {
        if (sets[key] != null && sets[key] != '') {
            setsArray.push(key + ' = ' + valueToString(sets[key]));
        }
    });
    var setsStr = setsArray.join(',');
    if (wheres) {
        var wheresStr = whereSql(wheres);
        return "update " + tableName + " set " + setsStr + " " + wheresStr;
    }
    else {
        return "update " + tableName + " set " + setsStr;
    }
}
exports.updateSql = updateSql;
function insertSql(tableName, prototypes) {
    var keysArray = [];
    var valuesArray = [];
    Object.keys(prototypes).forEach(function (key) {
        if (prototypes[key] != null && prototypes[key] != '') {
            keysArray.push(key);
            valuesArray.push(valueToString(prototypes[key]));
        }
    });
    var prototypesStr = keysArray.join(',');
    var valuesStr = valuesArray.join(',');
    return "insert into " + tableName + " (" + prototypesStr + ") values (" + valuesStr + ") ";
}
exports.insertSql = insertSql;
function delSql(tableName, wheres) {
    if (wheres) {
        var wheresStr = whereSql(wheres);
        return "delete from " + tableName + " " + wheresStr;
    }
    else {
        return "delete from " + tableName + " ";
    }
}
exports.delSql = delSql;
function countSql(tableName, wheres, options) {
    var prototypesStr = '1';
    if (wheres) {
        var wheresStr = whereSql(wheres);
        return "select count(" + prototypesStr + ") from " + tableName + " " + wheresStr;
    }
    else {
        return "select count(" + prototypesStr + ") from " + tableName;
    }
}
exports.countSql = countSql;
var getInfo = function (name, verifyConfig) {
    var result = {
        attribute: "",
        constraint: []
    };
    switch (verifyConfig.type) {
        case 'integer':
            result.attribute = name + " int";
            break;
        case 'string':
            result.attribute = name + " varchar(" + (verifyConfig.maxLength || 255) + ")";
            break;
        case 'date':
            result.attribute = name + " datetime";
            break;
    }
    if (verifyConfig.key) {
        result.constraint.push("PRIMARY KEY (" + name + ")");
    }
    if (verifyConfig.notNull) {
        result.attribute += ' NOT NULL';
    }
    if (verifyConfig.unique) {
        result.constraint.push("CONSTRAINT '" + verifyConfig.unique.toString() + "' UNIQUE (" + name + ")");
    }
    return result;
};
function createTable(tableName, verify, options) {
    var array = [];
    var constraint = [];
    Object.keys(verify).forEach(function (key) {
        var result = getInfo(key, verify[key]);
        result.attribute && array.push(result.attribute);
        result.constraint.length && (constraint = constraint.concat(result.constraint));
    });
    var sql = "CREATE TABLE  If Not Exists " + tableName + " (  " + array.join(',') + " " + (constraint.length == 0 ? '' : ',' + constraint.join(',')) + " );";
    return sql;
}
exports.createTable = createTable;
