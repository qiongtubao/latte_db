"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var Connect = (function () {
    function Connect(connect) {
        this.connect = connect;
    }
    Connect.prototype.get = function (key, callback) {
        this.connect.get(key, callback);
        return this;
    };
    Connect.prototype.getPromise = function (key) {
        return latte_lib['promise'].promisify(this.get.bind(this))(key);
    };
    Connect.prototype.set = function (key, value, callback) {
        this.connect.set(key, value, callback);
        return this;
    };
    Connect.prototype.setPromise = function (key, value) {
        return latte_lib['promise'].promisify(this.set.bind(this))(key, value);
    };
    Connect.prototype.close = function () {
        this.connect.quit();
        return this;
    };
    Connect.prototype.validate = function () {
        return this.connect && this.connect.stream && this.connect.stream._connecting;
    };
    Connect.prototype.hmset = function (key, value, callback) {
        this.connect.hmset(key, value, callback);
    };
    Connect.prototype.hmget = function (key, ks, callback) {
        this.connect.hmget(key, ks, function (err, data) {
            if (err) {
                return callback(err);
            }
            var result = {};
            data.forEach(function (value, index) {
                if (value != null && value != "undefined") {
                    result[ks[index]] = value;
                }
            });
            callback(null, result);
        });
        return this;
    };
    Connect.prototype.hmgetPromise = function (key, ks) {
        return latte_lib['promise'].promisify(this.hmget.bind(this))(key, ks);
    };
    Connect.prototype.del = function (key, callback) {
        this.connect.del(key, callback);
        return this;
    };
    Connect.prototype.delPromise = function (key) {
        return latte_lib['promise'].promisify(this.del.bind(this))(key);
    };
    Connect.prototype.rpush = function (key, value, callback) {
        this.connect.rpush(key, value, callback);
    };
    Connect.prototype.rpushPromise = function (key, value) {
        return latte_lib['promise'].promisify(this.del.bind(this))(key);
    };
    Connect.prototype.lpush = function (key, value, callback) {
        this.connect.lpush(key, value, callback);
        return this;
    };
    Connect.prototype.lpushPromise = function (key, value) {
        return latte_lib['promise'].promisify(this.lpush.bind(this))(key, value);
    };
    Connect.prototype.llen = function (key, callback) {
        this.connect.llen(key, callback);
        return this;
    };
    Connect.prototype.llenPromise = function (key) {
        return latte_lib['promise'].promisify(this.llen.bind(this))(key);
    };
    Connect.prototype.lrange = function (key, start, end, callback) {
        this.connect.lrange(key, start, end, callback);
        return this;
    };
    Connect.prototype.lrangePromise = function (key, start, end) {
        return latte_lib['promise'].promisify(this.lrange.bind(this))(key, start, end);
    };
    Connect.prototype.lpop = function (key, callback) {
        this.connect.lpop(key, callback);
        return this;
    };
    Connect.prototype.lpopPromise = function (key) {
        return latte_lib['promise'].promisify(this.lpop.bind(this))(key);
    };
    Connect.prototype.rpop = function (key, callback) {
        this.connect.rpop(key, callback);
        return this;
    };
    Connect.prototype.rpopPromise = function (key) {
        return latte_lib['promise'].promisify(this.rpop.bind(this))(key);
    };
    Connect.prototype.blpop = function (keys, timeout, callback) {
        keys.push(timeout);
        this.connect.blpop(keys, callback);
        return this;
    };
    Connect.prototype.blpopPromise = function (keys, timeout) {
        return latte_lib['promise'].promisify(this.blpop.bind(this))(keys, timeout);
    };
    Connect.prototype.lindex = function (key, index, callback) {
        this.connect.lindex(key, index, callback);
        return this;
    };
    Connect.prototype.lindexPromise = function (key, index) {
        return latte_lib['promise'].promisify(this.lindex.bind(this))(key);
        ;
    };
    Connect.prototype.lset = function (key, index, obj, callback) {
        this.connect.lset(key, index, obj, callback);
        return this;
    };
    Connect.prototype.lsetPromise = function (key, index, obj) {
        return latte_lib['promise'].promisify(this.lset.bind(this))(key, index, obj);
    };
    Connect.prototype.lrem = function (key, count, value, callback) {
        this.connect.lrem(key, count, value);
    };
    Connect.prototype.lremPromise = function (key, count, value) {
        return latte_lib['promise'].promisify(this.lrem.bind(this))(key, count, value);
    };
    Connect.prototype.sadd = function (key, value, callback) {
        this.connect.sadd(key, value, callback);
    };
    Connect.prototype.sismember = function (key, value, callback) {
        this.connect.sismember(key, value, callback);
    };
    Connect.prototype.scard = function (key, callback) {
        this.connect.scard(key, callback);
    };
    Connect.prototype.srem = function (key, value, callback) {
        this.connect.srem(key, value, callback);
    };
    Connect.prototype.sdiff = function (key, setName, callback) {
        this.connect.sdiff(key, setName, callback);
    };
    Connect.prototype.sdiffstore = function (key, setName, callback) {
        this.connect.sdiffstore(key, setName, callback);
    };
    Connect.prototype.sinter = function (key, setName, callback) {
        this.connect.sinter(key, setName, callback);
    };
    Connect.prototype.sinterstore = function (key, setName, callback) {
        this.connect.sinterstore(key, setName, callback);
    };
    Connect.prototype.sunion = function (key, setName, callback) {
        this.connect.sunion(key, setName, callback);
    };
    Connect.prototype.sunionstore = function (key, setName, callback) {
        this.connect.sunionstore(key, setName, callback);
    };
    Connect.prototype.smembers = function (key, callback) {
        this.connect.smembers(key, callback);
    };
    Connect.prototype.spop = function (key, callback) {
        this.connect.spop(key, callback);
    };
    Connect.prototype.srandmember = function (key, callback) {
        this.connect.srandmember(key, callback);
    };
    Connect.prototype.smove = function (key, value, setName, callback) {
        this.connect.smove(key, value, setName, callback);
    };
    Connect.prototype.zadd = function (key, k, score, callback) {
        this.connect.zadd(key, k, score, callback);
    };
    Connect.prototype.zrem = function (key, k, callback) {
        this.connect.zrem(key, key, callback);
    };
    Connect.prototype.zcard = function (key, callback) {
        this.connect.zcard(key, callback);
    };
    Connect.prototype.zscore = function (key, k, callback) {
        this.connect.zscore(key, k, callback);
    };
    Connect.prototype.zrange = function (key, min, max, WITHSCORES, callback) {
        this.connect.zrange(key, min, max, WITHSCORES, callback);
    };
    Connect.prototype.zrevrange = function (key, min, max, WITHSCORES, callback) {
        this.connect.zrevrange(key, min, max, WITHSCORES, callback);
    };
    Connect.prototype.zrevrangebyscore = function (key, min, max, WITHSCORES, callback) {
        this.connect.zrevrangebyscore(key, Math.max(min, max), Math.min(min, max), WITHSCORES, callback);
    };
    Connect.prototype.zrangebyscore = function (key, min, max, WITHSCORES, callback) {
        this.connect.zrangebyscore(key, min, max, WITHSCORES, callback);
    };
    Connect.prototype.zremrangebyscore = function (key, min, max, callback) {
        this.connect.zremrangebyscore(key, min, max, callback);
    };
    Connect.prototype.zremrangebyrank = function (key, min, max, callback) {
        this.connect.zremrangebyrank(key, min, max, callback);
    };
    Connect.prototype.keys = function (key, callback) {
        this.connect.keys(key, callback);
    };
    return Connect;
}());
exports.default = Connect;
