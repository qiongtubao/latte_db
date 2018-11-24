
import { VerifyClass, createVerify } from "latte_verify"
import { BaseClass } from "../baseClass"
class BaseObject {
    verifyObject: VerifyClass;
    data: any;
    private _data: any;
    constructor(key: string, verifyObject: VerifyClass) {
        this.verifyObject = verifyObject;
    }
    setValue(data) {
        try {
            this.verifyObject.verify(data)
        } catch (err) {
            data = null;
        }
        if (data == null) {
            return false;
        }
        this.data = data;
        return true;
    }
    flush() {
        this._data = this.data;
    }
    hasUpdate() {
        return JSON.stringify(this._data) !== JSON.parse(this.data);
    }
    toString() {
        return JSON.stringify(this.data);
    }
}
export class RedisString implements BaseClass<BaseObject>{
    key: string;
    verifyObject: VerifyClass;
    constructor(key, config) {
        this.key = key;
        this.verifyObject = createVerify(config);
    }
    add(data: BaseObject) {
        return (connect, callback) => {
            connect.set(this.key, data.toString(), (err, data) => {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.warn("redis string add ", data.key, "return 0");
                }
                return callback(err, data);
            })
        }
    }
    update(data: BaseObject) {
        return (connect, callback) => {
            connect.set(this.key, data.toString(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.info("redis string update ", data.key, "return 0");
                }
                data.flush();
                return callback(err, data);
            });
        }
    }
    del(data: BaseObject) {
        return (connect, callback) => {
            connect.del(this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.info("redis string del ", data.key, "return 0");
                }
                return callback(err, data);
            });
        }
    }
    query() {
        return (connect, callback) => {
            connect.get(this.key, (err, data) => {
                if (err) {
                    return callback(err);
                }
                if (data == null) {
                    console.info("redis string query ", this.key, "return 0");
                }
                var g = this.create(this.verifyObject);
                if (g.setValue(data)) {
                    return callback(err, g);
                } else {
                    return callback(new Error("type error"));
                }
            });
        }
    }
    create(value) {
        return new BaseObject(value, this.verifyObject);
    }
}
export default function (key, config) {
    let str = new RedisString(key, config);
    return str;
}