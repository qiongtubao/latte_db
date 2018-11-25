import * as latte_lib from "latte_lib"
import { VerifyClass, createVerifyClass } from "latte_verify"
import Connect from "../connect";
class TemplateClass {
    data: any;
    constructor(data) {
        this.data = data;
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
export class Set {
    private verifyObejct: VerifyClass;
    private key: string;
    constructor(key, config) {
        this.key = key;
        this.verifyObejct = createVerifyClass(config);
    }
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
    create(data) {
        try {
            data = this.verifyObejct.verify(data)
        } catch (err) {
            console.error(err)
            return null
        }
        return new TemplateClass(data);
    }
}
export function create(key, config) {
    return new Set(key, config);
}