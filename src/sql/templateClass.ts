import latte_verify from 'latte_verify'
import latte_lib from 'latte_lib'
import { connect } from 'tls';
interface Options {
  projection?: object;
  limie?: number[];
}
export default (tableName: string, config) => {
  let uniques: object = {};
  let key: string;
  Object.keys(config).forEach((k) => {
    if (config[k].key != null) {
      key = k;
    }
    if (config[k].unique != null) {
      uniques[config[k].unique] = uniques[config[k].unique] || [];
      uniques[config[k].unique].push(k);
    }
  });
  let getWhere = (g) => {
    return g.getWhere();
  }
  let isTemplateClass = (obj) => {
    return obj.constructor == templateClass;
  }
  class templateClass {
    data: any;
    updateData: any;
    oldData: object;
    constructor(data) {
      try {
        data = latte_verify.verify(data, {
          type: "object",
          properties: config
        });
      } catch (e) {
        console.log(e);
      }
      this.data = latte_lib['object'].create(data || {});
      this.updateData = latte_lib['object'].create({});//可能存在对象里面还有对象需要转成json
      this.oldData = latte_lib.copy(data) || {};
      var self = this;
      this.data.on("change", (key, value) => {
        self.updateData.set(key, value);
      });
    }

    update = (data) => {
      let self: templateClass = this;
      Object.keys(data).forEach((k) => {
        self.set(k, data[key]);
      });
      return this;
    }

    getWhere = () => {
      let result: object = {};
      if (this.oldData[key]) {
        result[key] = this.oldData[key];
        return result;
      }
      for (let i in uniques) {
        let r = true;
        for (let k = 0, len = uniques[i].length; k < len; k++) {
          if (this.oldData[uniques[i][k]] == undefined) {
            r = false;
            break;
          } else {
            result[uniques[i][k]] = this.oldData[uniques[i][k]];
          }
        }
        if (r == true) {
          return result;
        } else {
          result = {};
        }
      }
      return this.oldData;
    }
    get = (key) => {
      return this.data.get(key);
    }
    set = (key, value) => {
      //单层的

      if (key.indexOf('.') == -1) {
        try {
          value = latte_verify.verify(value, config[key]);
        } catch (e) {
          throw e;
        }
      }
      this.data.set(key, value);
      return this;
    }
    getUpdates = () => {
      return this.updateData.toJSON();
    }
    flush = () => {
      this.oldData = latte_lib.copy(this.data.toJSON());
      this.updateData = latte_lib['object'].create({});
      return this;
    }
    clean = () => {
      this.data = latte_lib['object'].create(latte_lib.copy(this.oldData));
      this.updateData = latte_lib['object'].create({});
      return this;
    }
    toJSON = () => {
      return this.data.toJSON();
    }
    static query = (wheres, options?: Options) => {
      if (isTemplateClass(wheres)) {
        wheres = wheres.toJSON();
      }
      return function (connect, callback) {
        options = options || {};
        if (!latte_lib.isFunction(callback)) {
          callback = function () { }
        }
        options.projection = options.projection || config;
        connect.query(tableName, wheres, options, function (err, data) {
          if (err) { return callback(err); }
          callback(null, data.map(function (d) {
            return templateClass.create(d);
          }));
        });
      }
    }
    static queryPromise = (wheres, options) => {
      return (connect) => {
        let func = templateClass.query(wheres, options);
        return latte_lib['promise'].promisify(func)(connect);
      }
    }
    static queryOne = (wheres, options: Options) => {
      if (isTemplateClass(wheres)) {
        wheres = getWhere(wheres);
      }
      return function (connect, callback) {
        options = options || {};
        if (!latte_lib.isFunction(callback)) {
          callback = function () { }
        }
        options.projection = options.projection || config;
        options.limie = [0, 1];
        connect.query(tableName, wheres, options, function (err, d) {
          if (err) { return callback(err); }
          callback(null, d[0] ? templateClass.create(d[0]) : null);
        });
      }
    }
    static del = (wheres: any) => {
      if (isTemplateClass(wheres)) {
        wheres = getWhere(wheres);
      }
      return (connect, callback) => {
        if (!latte_lib.isFunction(callback)) {
          callback = function () { };
        }
        connect.del(tableName, wheres, callback);
      }
    };
    static delPromise = (wheres: any) => {
      return (connect) => {
        let func = templateClass.del(wheres);
        return latte_lib['promise'].promisify(func)(connect);
      }
    }


    static create = (data) => {
      return new templateClass(latte_lib.copy(data));
    }

    static add = (g: templateClass) => {
      return (connect, callback) => {
        if (!latte_lib.isFunction(callback)) {
          callback = function () { }
        }
        connect.add(tableName, g.data.toJSON(), function (err, result0, result1) {
          if (err) { return callback(err); }
          if (config[key].type == "integer") {
            connect.addKey(key, g, result0, result1);
          }
          callback(null, g);
        });
      }
    }
    static addPromise = (g: templateClass) => {
      return (connect) => {
        let func = templateClass.add(g);
        return latte_lib['promise'].promisify(func)(connect);
      }
    }
    static count = (wheres) => {
      if (isTemplateClass(wheres)) {
        wheres = getWhere(wheres);
      }
      return (connect, callback) => {
        if (!latte_lib.isFunction(callback)) {
          callback = function () { };
        }
        connect.count(tableName, wheres, {}, function (err, result0, result1) {
          if (err) {
            return callback(err);
          }
          if (result0[0] != null && result0[0]["count(1)"] != null) {
            return callback(null, result0[0]["count(1)"]);
          } else {
            callback(new Error("latte_db templateClass count has bug"));
          }

        })
      }
    }
    static countPromise = (wheres) => {
      return (connect) => {
        let func = templateClass.count(wheres);
        return latte_lib['promise'].promisify(func)(connect);
      }
    }
    static createTable = (options) => {
      return (connect, callback) => {
        connect.createTable(tableName, config, options, callback);
      }
    }
    static update = (wheres, update?) => {
      let g;
      if (isTemplateClass(wheres)) {
        g = wheres;
        update = wheres.getUpdates();
        wheres = getWhere(wheres);
      }
      return function (connect, callback) {
        if (!latte_lib.isFunction(callback)) {
          callback = function () { };
        }
        connect.update(tableName, update, wheres, function (err, result0, result1) {
          g && g.flush();
          callback(err, result0);
        })
      }
    }
    static updatePromise = (wheres, update) => {
      return (connect) => {
        let func = templateClass.update(wheres, update);
        return latte_lib['promise'].promisify(func)(connect);
      }
    }

  }

  return templateClass;
}