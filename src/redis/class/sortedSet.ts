import * as latte_lib from "latte_lib"
import { VerifyClass } from "latte_verify"
import { BaseClass } from "../baseClass"
class SortedSetObject {
    data: any;
    score: number;
    private _score: number;
    constructor(data, score) {
        this.data = data;
        this.score = score;
        this._score = score;
    }
    setScore(score) {
        this.score = score;
    }
    getScore() {
        return this.score;
    }
    getData() {
        if (latte_lib.utils.isObject(this.data)) {
            return JSON.stringify(this.data);
        } else if (latte_lib.object.isLatteObject(this.data)) {
            return JSON.stringify(this.data.data);
        } else {
            return this.data;
        }
    }
    flush() {
        this._score = this.score;
    }
    hasUpdate() {
        return this._score == this.score;
    }
}
export class SortedSet implements BaseClass<SortedSetObject> {
    key: string;
    verifyObject: VerifyClass;
    update(data) {
        return (connect, callback) => {
            connect.zadd(this.key, data.getData(), data.getScore(), (err, data) => {
                if (err) {
                    return callback(err)
                }
                data.flush();
                callback(null, data);
            })
        }
    }
    del(data) {
        return (connect, callback) => {
            connect.zrem(this.key, data.getScore(), (err, data) => {
                if (err) {
                    return callback(err)
                }
                return callback(err, data)
            });
        }
    }
    delByIndex(min, max) {
        return (connect, callback) => {
            connect.zremrangebyrank(this.key, min, max, (err, data) => {
                if (err) {
                    return callback(err)
                }
                return callback(err, data)
            });
        }
    }
    delByScore(min, max) {
        return (connect, callback) => {
            connect.zremranggebyscore(this.key, min, max, (err, data) => {
                if (err) {
                    return callback(err)
                }
                return callback(err, data)
            });
        }
    }
    delAll() {
        return (connect, callback) => {
            connect.del(this.key, (err, data) => {
                if (err) {
                    return callback(err)
                }
                return callback(err, data)
            });
        }
    }
    getByIndex(start, end) {
        let method, min, max;
        if (start < 0 && end < 0) {
            if (start < end) {
                method = "zrange";
                min = start;
                max = end;
            } else {
                method = "zrevrange";
                max = start;
                min = end;
            }
        } else if (start > 0 && end > 0) {
            if (start < end) {
                method = "zrange";
                min = start;
                max = end;
            } else {
                method = "zrevrange";
                min = end;
                max = start;
            }
        } else {
            if (start > end) {
                method = "zrange"
                min = start;
                max = end;
            } else {
                method = "zrevrange"
                min = end;
                max = start;
            }
        }
        let self = this;
        return (connect, callback) => {
            connect[method](this.key, min, max, "withscores", (err, data) => {
                if (err) {
                    return callback(err)
                }
                let result = []
                for (let i = 0, len = data.length / 2; i < len; i++) {
                    let d = self.create(data[2 * i], data * i + 1);
                    result.push(d)
                }
                return callback(err, result)
            });
        }
    }
    getAll() {
        let self = this;
        return (connect, callback) => {
            connect.zrange(this.key, 0, -1, "WITHSCORES", (err, data) => {
                if (err) {
                    return callback(err)
                }
                var result = []
                for (let i = 0, len = data.length / 2; i < len; i++) {
                    let d = self.create(data[2 * i], data[2 * i + 1])
                    result.push(d)
                }
                return callback(err, result)
            });
        }
    }
    getAllSize() {
        return (connect, callback) => {
            connect.zcard(this.key, callback)
        }
    }
    getByScore(start, end) {
        let method, min, max;
        if (start < end) {
            method = "zrangebyscore"
            min = start
            max = end;
        } else {
            method = "zrevrangebyscore"
            min = end;
            max = start;
        }
        let self = this;
        return (connect, callback) => {
            connect[method](this.key, min, max, (err, data) => {
                if (err) {
                    return callback(err)
                }
                let result = []
                for (let i = 0, len = data.length / 2; i < len; i++) {
                    let d = self.create(data[2 * i], data[2 * i + 1]);
                    result.push(d)
                }
                return callback(err, result);
            });
        }
    }
    getByKey(mkey) {
        return (connect, callback) => {
            connect.zscore(this.key, mkey, (err, data) => {
                if (err) {
                    return callback(err)
                }
                let d = this.create(mkey, data)
                return callback(null, d);
            });
        }
    }
    size(min, max) {
        return (connect, callback) => {
            connect.zcount(this.key, min, max, "withscores", (err, data) => {
                if (err) {
                    return callback(err)
                }
                callback(null, data)
            });
        }
    }
    add(data: SortedSetObject) {
        return (connect, callback) => {
            connect.zadd(this.key, data.getScore(), data.getData(), (err, data) => {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        }
    }
    create(data, score): SortedSetObject {
        let result;
        try {
            result = this.verifyObject.verify(data);
        } catch (err) {
            return null;
        }
        return new SortedSetObject(result, score);
    }
}