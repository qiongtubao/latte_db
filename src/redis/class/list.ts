import * as latte_lib from "latte_lib"
import * as latte_verify from "latte_verify"
import { connect } from "net";

export function toValue(v: any) {
    if (latte_lib.utils.isObject(v)) {
        return JSON.stringify(v);
    } else if (latte_lib.object.isLatteObject(v)) {
        return JSON.stringify(v);
    } else {
        return v;
    }
}
export default function create(key: any, config: any) {
    return class List {
        data: any;
        _data: any;
        constructor(value) {
            try {
                value = latte_verify.verify(value, config);
            } catch (err) {
                console.log("list object verify Error", err);
                return null;
            }
            this.data = value;
            this._data = latte_lib.clone(value);
        }
        set(value) {
            try {
                value = latte_verify.verify(value, config);
            } catch (err) {
                console.log("list object verify Error", err);
                return null;
            }
            this.data = value;
        }
        get() {
            return this.data;
        }
        flush() {
            this._data = latte_lib.utils.clone(this.data);
        }
        toJSON() {
            return this.data.toJSON();
        }
        static push(list: List) {
            return (connect, callback) => {
                connect.rpush(key, toValue(list.data), (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    if (result == 0) {
                        // latte_lib.debug.info("redis list push ", key, "return 0");
                    }
                    return callback(null, list);
                })
            }
        }
        static size() {
            return (connect, callback) => {
                connect.llen(key, callback);
            }
        }
        static unshift(list: List) {
            return (connect, callback) => {
                connect.lpush(key, toValue(list.data), (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                        // latte_lib.debug.info("redis list push ", key, "return 0");
                    }
                    return callback(null, list);
                });
            }
        }
        static shift() {
            return (connect, callback) => {
                connect.lpop(key, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (data) {
                        var g = new List(data);
                        return callback(null, g);
                    } else {
                        return callback();
                    }
                });
            }
        }
        static pop() {
            return (connect, callback) => {
                connect.rpop(key, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (data) {
                        var g = new List(data);
                        return callback(null, g);
                    } else {
                        return callback();
                    }
                });
            }
        }
        static waitShift() {
            return (connect, callback) => {
                connect.blpop([key], 0, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data[1]);
                    callback(null, g);
                })
            }
        }
        static waitPop() {
            return (connect, callback) => {
                connect.brpop([key], 0, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data[1]);
                    callback(null, g);
                });
            }
        }
        static getAll(min: number = 0, max: number = -1) {
            return (connect, callback) => {
                connect.lrange(key, min, max, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, data.map(function (o) {
                        return new List(o);
                    }));
                })
            }
        }
        static create(value) {
            return new List(value);
        }
        static get(index) {
            return (connect, callback) => {
                connect.lindex(key, index, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    var g = new List(data);
                    callback(null, g);
                });
            }
        }
        static set(index, list) {
            return (connect, callback) => {
                connect.lset(key, index, toValue(list.data), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                        // latte_lib.debug.info("redis list set ", key, index, "return 0");
                    }
                    callback(null, list);
                });
            }
        }
        static del(list, index: number = 1) {
            return (connect, callback) => {
                connect.lrem(key, 1, toValue(list.data), function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                        // latte_lib.debug.info("redis list del ", key, index, "return 0");
                    }
                    callback(null, data);
                });
            }
        }
        static delAll() {
            return (connect, callback) => {
                connect.del(key, function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    if (data == 0) {
                        // latte_lib.debug.info("redis list delAll ", key, index, "return 0");
                    }
                    callback(null, data);
                });
            }
        }
    }
}