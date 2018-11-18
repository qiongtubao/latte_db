import latte_verify, { VerifyClass, createVerifyClass } from 'latte_verify'
import * as latte_lib from 'latte_lib'
import { connect } from 'net';
import { timingSafeEqual } from 'crypto';
interface Options {
  projection?: object;
  limie?: number[];
}
class DataClass {
  private data: any;
  private oldData: any;
  private updateData: any = {}
  private uniques: any;
  private _data: any;
  private key: string;
  private config: any;
  constructor(config, data, options) {
    this.config = config;
    this.key = options.key;
    this.uniques = options.uniques;

    this.data = latte_lib.object.create(data || {})
    this.updateData = latte_lib.object.create({})
    this._data = latte_lib.utils.copy(data) || {};
    this.data.on("change", (key, value) => {
      this.updateData.set(key, value);
    });
  }
  getData() {
    return this.data.data;
  }
  update(data) {
    for (let key in data) {
      this.data[key] = data[key]
    }
  }
  getWhere() {
    let result = {}
    if (this._data[this.key]) {
      result[this.key] = this._data[this.key]
      return result
    }
    for (let i in this.uniques) {
      let v = true;
      for (let k = 0, len = this.uniques[i].length; k < len; k++) {
        if (this._data[this.uniques[i][k]] == null) {
          v = false;
          break;
        } else {
          result[this.uniques[i][k]] = this._data[this.uniques[i][k]]
        }
      }
      if (v == true) {
        return result
      } else {
        result = {}
      }
    }
  }
  get(key) {
    return this.data[key]
  }
  set(key, value) {
    if (key.indexOf('.') == -1) {
      try {
        value = latte_verify.verify(value, this.config[key]);
      } catch (e) {
        throw e;
      }
    }
    this.data.set(key, value)
  }
  getUpdates() {
    let result = {}
    Object.keys(this.updateData.data).forEach((key) => {
      result[key] = this.data.data[key];
    });
    return result;
  }
  flush() {
    this._data = latte_lib.utils.copy(this.data.data)
    this.updateData = latte_lib.object.create({});
  }
  toJSON() {
    return this.data.toJSON()
  }
}
function isDataClass(obj) {
  return obj.constructor == DataClass;
}
class TemplateClass {
  private tableName: string;
  private config: any;
  uniques: any = {};
  key: string;
  constructor(name, config) {
    this.tableName = name;
    this.uniques = {};
    let key;
    for (let i in config) {
      if (config[i].key != null) {
        key = i;
      }
      if (config[i].unique != null) {
        this.uniques[config[i].unique] = this.uniques[config[i].unique] || [];
        this.uniques[config[i].unique].push(i);
      }
    }
    this.key = key;
    this.config = config;
  }
  queryOnePromise(wheres, options) {
    return (connect) => {
      let func = this.query(wheres, options);
      return latte_lib.promise.promisify(func)(connect)
    }
  }
  queryOne(wheres, options) {
    if (isDataClass(wheres)) {
      wheres = wheres.toJSON()
    }
    return (connect, callback) => {
      options = options || {}
      if (!latte_lib.utils.isFunction(callback)) {
        console.warn("queryOne callback is not Function")
        callback = () => {

        }
      }
      options.projection = options.projection || this.config;
      options.limie = [0, 1];
      connect.query(this.tableName, wheres, options, function (err, d) {
        if (err) { return callback(err); }
        callback(null, d[0] ? this.create(d[0]) : null);
      })
    }
  }
  queryPromise(wheres, options) {
    return (connect) => {
      return latte_lib.promise.promisify(this.query(wheres, options), connect);
    }
  }
  query(wheres, options) {
    if (isDataClass(wheres)) {
      wheres = wheres.toJSON()
    }
    return (connect, callback) => {
      options = options || {}
      if (!latte_lib.utils.isFunction(callback)) {
        console.warn("query callback is not Function")
        callback = () => { };
      }
      options.projection = options.projection || this.config;
      connect.query(this.tableName, wheres, options, (err, data) => {
        if (err) { return callback(err); }
        console.log(data);
        callback(null, connect.queryResultArray(data).map((d) => {
          return this.create(d);
        }));
      });
    }
  }
  updatePromise(wheres, update) {
    return (connect) => {
      let func = this.update(wheres, update);
      return latte_lib.promise.promisify(func)(connect);
    }
  }
  update(wheres, update) {
    let g;
    if (isDataClass(wheres)) {
      g = wheres;
      update = wheres.getUpdates()
      wheres = wheres.getWhere();
    }
    return (connect, callback) => {
      if (!latte_lib.utils.isFunction(callback)) {
        console.error("update callback is not Function");
        callback = function () { }
      }
      connect.update(this.tableName, update, wheres, (err, result0, result1) => {
        g && g.flush();
        callback(err, wheres);
      });
    }
  }
  delPromise(wheres) {
    return (connect) => {
      let func = this.del(wheres);
      return latte_lib.promise.promisify(func)(connect);
    }
  }
  del(wheres) {
    if (isDataClass(wheres)) {
      wheres = wheres.getWhere();
    }
    return (connect, callback) => {
      if (!latte_lib.utils.isFunction(callback)) {
        console.error("del callback is not Function");
        callback = function () { }
      }
      connect.del(this.tableName, wheres, (err, result0, result1) => {
        console.log(result0, result1)
        callback(err, this);
      });
    }
  }
  addPromise(data) {
    return (connect) => {
      let func = this.add(data);
      return latte_lib.promise.promisify(func)(connect);
    }
  }
  add(data: DataClass) {
    return (connect, callback) => {
      if (!latte_lib.utils.isFunction(callback)) {
        console.error("add callback is not Function");
        callback = function () { }
      }
      connect.add(this.tableName, data.getData(), (err, result0, result1) => {
        if (err) { return callback(err); }
        if (this.config[this.key].type == "integer") {
          connect.addKey(this.key, data, result0, result1);
        }
        callback(null, data);
      });
    }
  }
  createTable(options) {
    return (connect, callback) => {
      connect.createTable(this.tableName, this.config, options, callback);
    }
  }
  create(data) {
    return new DataClass(this.config, data, {
      key: this.key,
      uniques: this.uniques
    });
  }
  countPromise(data) {
    return (connect) => {
      return latte_lib.promise.promisify(this.count(data), connect);
    }
  }
  count(wheres) {
    if (isDataClass(wheres)) {
      wheres = wheres.getWhere(wheres)
    }
    return (connect, callback) => {
      if (!latte_lib.utils.isFunction(callback)) {
        console.error("count callback is not Function");
        callback = function () { };
      }
      connect.count(this.tableName, wheres, {}, (err, result0, result1) => {
        if (err) {
          return callback(err);
        }
        if (result0[0] != null && result0[0]["count(1)"] != null) {
          return callback(null, result0[0]["count(1)"]);
        } else {
          callback(new Error("latte_db templateClass count has bug"));
        }

      });
    }
  }

}
export default (tableName: string, config) => {
  let template = new TemplateClass(tableName, config);
  return template;
}