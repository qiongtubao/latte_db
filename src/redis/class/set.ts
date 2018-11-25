import * as latte_lib from "latte_lib"
import { VerifyClass, createVerifyClass } from "latte_verify"
import Connect from "../connect";
import { StringifyOptions } from "querystring";
import { BaseClass } from "../baseClass";
class BaseObject {
    data: any;
    private _data: any;
    verifyObject: VerifyClass;
    constructor(verifyObject: VerifyClass) {
        this.verifyObject = verifyObject;
    }
    set(data) {
        try {
            data = this.verifyObject.verify(data)
        } catch (err) {
            return false;
        }
        this.data = data;
        return true;
    }
    flush() {
        this.data = this._data;
    }
    toKey() {
        if (latte_lib.utils.isObject(this.data)) {
            return JSON.stringify(this.data);
        } else if (latte_lib.object.isLatteObject(this.data)) {
            return JSON.stringify(this.data);
        } else {
            return this.data;
        }
    }
    toJSON() {
        return this.data.toJSON()
    }
}
export class Set implements BaseClass<BaseObject>{
    key: string;
    verifyObject: VerifyClass;
    getAll() {
        return (connect: Connect, callback) => {
            connect.smembers(this.key, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            });
        }
    }
    size() {
        return (connect, callback) => {
            connect.scard(this.key, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            });
        }
    }
    union(setName) {
        return (connect: Connect, callback) => {
            connect.sunion(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data.map((d) => {
                    return this.create(d);
                }))
            })
        }
    }
    unionSize(setName) {
        return (connect: Connect, callback) => {
            connect.sunionstore(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            })
        }
    }
    inter(setName) {
        return (connect: Connect, callback) => {
            connect.sinter(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data.map(d => {
                    return this.create(d)
                }))
            })
        }
    }
    interSize(setName) {
        return (connect: Connect, callback) => {
            connect.sinterstore(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            })
        }
    }
    diff(setName) {
        return (connect: Connect, callback) => {
            connect.sdiff(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data.map(d => {
                    return this.create(d)
                }))
            })
        }
    }
    diffSize(setName) {
        return (connect: Connect, callback) => {
            connect.sdiffstore(this.key, setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            })
        }
    }
    pop() {
        return (connect, callback) => {
            connect.spop(this.key, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, this.create(data))
            })
        }
    }
    rand() {
        return (connect, callback) => {
            connect.srandmember(this.key, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, this.create(data))
            })
        }
    }
    move(g, setName) {
        return (connect: Connect, callback) => {
            connect.smove(this.key, g.toKey(), setName, (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            })
        }
    }
    has(g) {
        return (connect: Connect, callback) => {
            connect.sismember(this.key, g.toKey(), (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, !!data)
            });
        }
    }
    del(g) {
        return (connect: Connect, callback) => {
            connect.srem(this.key, g.toKey(), (err, data) => {
                if (err) {
                    return callback(err)
                }
                if (data == 0) {
                    console.warn("set deled ", this.key, g.toKey());
                }
                callback(null, g)
            })
        }
    }
    add(g) {
        return (connect: Connect, callback) => {
            connect.sadd(this.key, g.toKey(), (err, data) => {
                if (err) {
                    return callback(err)
                }
                if (data == 0) {
                    console.warn("set added", this.key, g.toKey())
                }
                callback(null, g)
            })
        }
    }
    create(data): BaseObject {

        let baseObject = new BaseObject(this.verifyObject);
        if (!baseObject.set(data)) {
            return null;
        }
        return baseObject;

    }
}
