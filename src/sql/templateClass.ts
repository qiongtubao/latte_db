import latte_verify from 'latte_verify'
import latte_lib from 'latte_lib'
interface Options {
  projection?: object;
  limie?: number[];
}
export default (tableName, config) => {
  let uniques = {};
  let key;
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
    data: latte_lib.object;
    updateData: latte_lib.object;
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
      this.data = latte_lib.object.create(data || {});
      this.updateData = latte_lib.object.create({});//可能存在对象里面还有对象需要转成json
      this.oldData = latte_lib.copy(data) || {};
      var self = this;
      this.data.on("change", (key, value) => {
        self.updateData.set(key, value);
      });
    }

    update = (data) => {
      let self = this;
      Object.keys(data).forEach((k) => {
        self.set(k, data[key]);
      });
    }

    getWhere = () => {
      let result = {};
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
          value = latte_verify.verifyPrototype(value, config[key]);
        } catch (e) {
          throw e;
        }
      }
      return this.data.set(key, value);
    }
    getUpdates = () => {
      return this.updateData.toJSON();
    }
    flush = () => {
      this.oldData = latte_lib.copy(this.data.toJSON());
      this.updateData = latte_lib.object.create({});
    }
    clean = () => {
      this.data = latte_lib.object.create(latte_lib.copy(this.oldData));
      this.updateData = latte_lib.object.create({});
    }
    toJSON = () => {
      return this.data.toJSON();
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
    static create = (data) => {
      return new templateClass(latte_lib.copy(data));
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
        return latte_lib.promise.promisify(func)(connect);
      }
    }
  }

  return templateClass;
}