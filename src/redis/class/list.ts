import { BaseObject, BaseClass } from "../baseClass";
import { VerifyClass } from "latte_verify"



export class List implements BaseClass<BaseObject> {
    key: string;
    verifyObject: VerifyClass;
    push(g) {
        return (connect, callback) => {
            connect.rpush(this.key, g.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(null, g);
            });
        }
    }
    size() {
        return (connect, callback) => {
            connect.llen(this.key, callback);
        }
    }
    unshift(list: BaseObject) {
        return (connect, callback) => {
            connect.lpush(this.key, list.toString(), (err, data) => {
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
    shift() {
        return (connect, callback) => {
            connect.lpop(this.key, (err, data) => {
                if (err) {
                    return callback(err);
                }
                let listObject = this.create(this.verifyObject)
                return callback(null, listObject)
            });
        }
    }
    pop() {
        return (connect, callback) => {
            connect.rpop(this.key, (err, data) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, this.create(data))
            });
        }
    }
    waitShift() {
        return (connect, callback) => {
            connect.blpop([this.key], 0, (err, data) => {
                if (err) {
                    return callback(err);
                }
                var g = this.create(data)
                callback(null, g);
            })
        }
    }
    waitPop() {
        return (connect, callback) => {
            connect.brpop([this.key], 0, (err, data) => {
                if (err) {
                    return callback(err);
                }
                var g = this.create(data);
                callback(null, g);
            });
        }
    }
    getAll(min: number = 0, max: number = -1) {
        return (connect, callback) => {
            connect.lrange(this.key, min, max, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data.map((o) => {
                    return this.create(o);
                }));
            })
        }
    }
    create(value) {

        let base = new BaseObject(this.verifyObject);
        if (!base.set(value)) {
            return null;
        } else {
            return base;
        }
    }
    get(index) {
        return (connect, callback) => {
            connect.lindex(this.key, index, (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, this.create(data));
            });
        }
    }
    set(index, list: BaseObject) {
        return (connect, callback) => {
            connect.lset(this.key, index, list.toString(), function (err, data) {
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
    del(list, index: number = 1) {
        return (connect, callback) => {
            connect.lrem(this.key, 1, list.toString(), function (err, data) {
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
    delAll() {
        return (connect, callback) => {
            connect.del(this.key, function (err, data) {
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