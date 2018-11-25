
import Connect from "../connect"
class HashObject {
    key: string;
    value: any;
    private _value: any;
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this._value = value;
    }
    getUpdates() {

    }
    hasUpdate() {
        return JSON.stringify(this.value) == JSON.stringify(this._value)
    }
    flush() {
        this._value = this.value;
    }
    toJSON() {
        return this.value;
    }
}
export class Hash {
    crate(key, value) {
        return new HashObject(key, value);
    }
    add(t: HashObject) {
        return function (connect: Connect, callback = (err, result = undefined) => { }) {
            let v = {};
            let value = t.toJSON();
            for (let i in value) {
                v[i] = JSON.stringify(value[i]);
            }
            connect.hmset(t.key, v, callback);
        }
    }
    del(t: HashObject) {
        return function (connect: Connect, callback = (err, result = undefined) => { }) {
            connect.del(t.key, callback);
        }
    }
    update(t: HashObject) {
        return function (connect: Connect, callback = (err, result = undefined) => { }) {
            connect.hmset(t.key, t.getUpdates(), callback);
        }
    }
    get(key: string) {
        return function (connect: Connect, callback = (err, result = undefined) => { }) {
            console.log(this.verifyObject);
            // connect.hmget(key, Object.keys(config), function (err, data) {
            //     if (err) { return callback(err); }
            //     var g = new HashObject(key, data);
            //     callback(null, g);
            // });
        }
    }
    keys(key) {
        return function (connect: Connect, callback = (err, result = undefined) => { }) {
            connect.keys(key, callback);
        }
    }
}