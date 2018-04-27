import latte_lib from 'latte_lib'

let valueToString = (value) => {
  if (latte_lib.isString(value)) {
    //当json转换成对象的时候会出现"   所以最外层设置为'
    return '\'' + value + '\'';
  } else if (latte_lib.isObject(value)) {
    return "'" + JSON.stringify(value) + "'";
  } else if (latte_lib.object.isLatteObject(value)) {
    return "'" + JSON.stringify(value) + "'";
  }
  return value;
}
let v2s = (k, v) => {
  let pindex = k.indexOf('.');
  let kindex = k.indexOf('[');
  let index;
  if (pindex == -1) {
    index = kindex;
  } else if (kindex == -1) {
    index = pindex;
  } else {
    index = Math.min(kindex, pindex);
  }
  let f = "";
  if (index != -1) {
    let jk = "$" + k.substring(index).split('.').map((a) => {
      if (a == "") {
        return "";
      } else if (a.indexOf("[") == 0) {
        return a;
      } else if (a.indexOf('"') != 0) {
        let akIndex = a.indexOf('[');
        if (akIndex == -1) {
          return '"' + a + +'"';
        } else {
          return '"' + a.substring(0, akIndex) + '"' + a.substring(akIndex);
        }
      } else {
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
    } else {
      return k + "->'" + jk + "'=" + valueToString(v);
    }
  } else {
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
    } else {
      return k + " = " + valueToString(v);
    }
  }

}
let j2s = (where) => {
  let array = [];
  for (let i in where) {
    let o = where[i];
    if (o.$or) {
      array.push("(" + o.$or.map((v) => {
        return v2s(i, v);
      }).join(" or ") + ")");
    } else {
      array.push(v2s(i, o));
    }
  }
  return "(" + array.join(" and ") + ")";
}
export function whereSql(wheres) {
  if (!wheres) {
    return "";
  }
  let keys = Object.keys(wheres);
  if (keys.length == 0) {
    return "";
  }
  let whereStr = "where ";
  if (latte_lib.isObject(wheres)) {
    if (wheres.$or) {
      whereStr += wheres.$or.map((v) => {
        return j2s(v);
      }).join(" or ");
    } else {
      whereStr += j2s(wheres);
    }
  } else if (latte_lib.isArray(wheres)) {
    whereStr += wheres.map((v) => {
      return j2s(v);
    }).join(" and ");
  }
  return whereStr;
}


export function querySql(tableName, wheres, options) {
  let prototypesStr;
  if (options) {
    if (options.projection) {
      prototypesStr = Object.keys(options.projection).join(',') || '*';
    } else {
      prototypesStr = '*';
    }
  } else {
    prototypesStr = '*';
  }
  if (wheres) {
    let wheresStr = whereSql(wheres);
    if (options && options.limit && options.limit.length == 2) {
      let limits = options.limit.join(',');
      return `select ${prototypesStr} from ${tableName} ${wheresStr} limit ${limits} ;`;
    } else {
      return `select ${prototypesStr} from ${tableName} ${wheresStr} ;`;
    }
  } else {
    return `select ${prototypesStr} from ${tableName} ;`;
  }



}
export function updateSql(tableName, sets, wheres) {
  let setsArray = [];
  Object.keys(sets).forEach(function (key) {
    if (sets[key] != null && sets[key] != '') {
      setsArray.push(key + ' = ' + valueToString(sets[key]));
    }
  });
  const setsStr = setsArray.join(',');
  if (wheres) {
    let wheresStr = whereSql(wheres);
    return `update ${tableName} set ${setsStr} ${wheresStr}`;
  } else {
    return `update ${tableName} set ${setsStr}`;
  }
}

export function insertSql(tableName, prototypes) {
  let keysArray = [];
  let valuesArray = [];
  Object.keys(prototypes).forEach(function (key) {
    if (prototypes[key] != null && prototypes[key] != '') {
      keysArray.push(key);
      valuesArray.push(valueToString(prototypes[key]));
    }
  });
  const prototypesStr = keysArray.join(',');
  const valuesStr = valuesArray.join(',');
  return `insert into ${tableName} (${prototypesStr}) values (${valuesStr}) `;
}

export function delSql(tableName, wheres) {
  if (wheres) {
    const wheresStr = whereSql(wheres);
    return `delete from ${tableName} ${wheresStr}`
  } else {
    return `delete from ${tableName} `;
  }
}

export function countSql(tableName, wheres, options) {
  let prototypesStr = '1';
  if (wheres) {
    const wheresStr = whereSql(wheres);
    return `select count(${prototypesStr}) from ${tableName} ${wheresStr}`;
  } else {
    return `select count(${prototypesStr}) from ${tableName}`;
  }
}