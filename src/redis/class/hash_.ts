


import latte_verify from "latte_verify"
import * as latte_lib from "latte_lib"
import Connect from "../connect"
function getObject(data) {
  let data1 = latte_lib.utils.copy(data);
  Object.keys(data1).forEach((key) => {
    data1[key] = JSON.stringify(data1[key]);
  });
  return data1;
}
export function create(config) {
  return class templateClass {
    key: string;
    data: latte_lib.object;
    updateData: latte_lib.object;
    oldData: latte_lib.object;
    constructor(key: string, data) {
      this.key = key;
      try {
        data = latte_verify.verify(data, config);
      } catch (e) {
        console.error('redis hash key');
      }
      this.data = latte_lib.object.create(data || {});
      this.updateData = latte_lib.object.create({});//可能存在对象里面还有对象需要转成json
      this.oldData = latte_lib.utils.copy(data) || {};
      this.data.on("change", (key, value) => {
        this.updateData.set(key, value);
      });
    }
    get(key) {
      return this.data.get(key);
    }
    set(key, value) {
      if (key.indexOf('.') == -1) {
        try {
          value = latte_verify.verify(value, config[key]);
        } catch (e) {
          throw e;
        }
      }
      this.data.set(key, value);
    }

    getUpdates() {
      return getObject(this.updateData);
    }
    getAll() {
      return getObject(this.data);
    }
    flush() {
      this.oldData = latte_lib.utils.copy(this.data.toJSON());
      this.updateData = latte_lib.object.create({});
    }
    toJSON() {
      return this.data.toJSON();
    }
    static crate(key, value) {
      return new templateClass(key, value);
    }
    static add(t: templateClass) {
      return function (connect, callback = (err, result = undefined) => { }) {
        let v = {};
        let value = t.toJSON();
        for (let i in value) {
          v[i] = JSON.stringify(value[i]);
        }
        connect.hmset(t.key, v, callback);
      }
    }
    static del(t: templateClass) {
      return function (connect, callback = (err, result = undefined) => { }) {
        connect.del(t.key, callback);
      }
    }
    static update(t: templateClass) {
      return function (connect, callback = (err, result = undefined) => { }) {
        connect.hmset(t.key, t.getUpdates(), callback);
      }
    }
    static get(key: string) {
      return function (connect, callback = (err, result = undefined) => { }) {
        connect.hmget(key, Object.keys(config), function (err, data) {
          if (err) { return callback(err); }
          var g = new templateClass(key, data);
          callback(null, g);
        });
      }
    }
    static keys(key) {
      return function (connect: Connect, callback = (err, result = undefined) => { }) {
        connect.keys(key, callback);
      }
    }
  }
}