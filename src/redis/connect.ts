import * as latte_lib from "latte_lib"
import { Client } from "redis"
export default class Connect {
  connect: Client;
  constructor(connect) {
    this.connect = connect;
  }
  get(key: string, callback: Function) {
    this.connect.get(key, callback);
    return this;
  }
  getPromise(key: string) {
    return latte_lib['promise'].promisify(this.get.bind(this))(key);
  }
  set(key: string, value: string, callback: Function) {
    this.connect.set(key, value, callback);
    return this;
  }
  setPromise(key: string, value: string) {
    return latte_lib['promise'].promisify(this.set.bind(this))(key, value);
  }
  close() {
    this.connect.quit();
    return this;
  }
  validate() {
    return this.connect && this.connect.stream && this.connect.stream._connecting;
  }
  hmset(key, value, callback) {
    this.connect.hmset(key, value, callback);
  }
  hmget(key, ks, callback) {
    this.connect.hmget(key, ks, function (err, data) {
      if (err) {
        return callback(err);
      }
      let result = {};
      data.forEach((value, index) => {
        if (value != null && value != "undefined") {
          result[ks[index]] = value;
        }
      });
      callback(null, result);
    });
    return this;
  }
  hmgetPromise(key, ks) {
    return latte_lib['promise'].promisify(this.hmget.bind(this))(key, ks);
  }
  del(key: string, callback) {
    this.connect.del(key, callback);
    return this;
  }
  delPromise(key: string) {
    return latte_lib['promise'].promisify(this.del.bind(this))(key);
  }
  rpush(key: string, value: string, callback) {
    this.connect.rpush(key, value, callback);
  }
  rpushPromise(key: string, value: string) {
    return latte_lib['promise'].promisify(this.del.bind(this))(key);
  }
  lpush(key: string, value: string, callback) {
    this.connect.lpush(key, value, callback);
    return this;
  }
  lpushPromise(key: string, value: string) {
    return latte_lib['promise'].promisify(this.lpush.bind(this))(key, value);
  }
  llen(key: string, callback: Function) {
    this.connect.llen(key, callback);
    return this;
  }
  llenPromise(key: string) {
    return latte_lib['promise'].promisify(this.llen.bind(this))(key);
  }
  lrange(key, start, end, callback) {
    this.connect.lrange(key, start, end, callback);
    return this;
  }
  lrangePromise(key, start, end) {
    return latte_lib['promise'].promisify(this.lrange.bind(this))(key, start, end);
  }
  lpop(key, callback) {
    this.connect.lpop(key, callback);
    return this;
  }
  lpopPromise(key) {
    return latte_lib['promise'].promisify(this.lpop.bind(this))(key);
  }
  rpop(key, callback) {
    this.connect.rpop(key, callback);
    return this;
  }
  rpopPromise(key) {
    return latte_lib['promise'].promisify(this.rpop.bind(this))(key);
  }
  blpop(keys, timeout, callback) {
    keys.push(timeout);
    this.connect.blpop(keys, callback);
    return this;
  }
  blpopPromise(keys, timeout) {
    return latte_lib['promise'].promisify(this.blpop.bind(this))(keys, timeout);
  }
  lindex(key, index, callback) {
    this.connect.lindex(key, index, callback);
    return this;
  }
  lindexPromise(key, index) {
    return latte_lib['promise'].promisify(this.lindex.bind(this))(key);;
  }
  lset(key, index, obj, callback) {
    this.connect.lset(key, index, obj, callback);
    return this;
  }
  lsetPromise(key, index, obj) {
    return latte_lib['promise'].promisify(this.lset.bind(this))(key, index, obj);
  }
  lrem(key, count, value, callback) {
    this.connect.lrem(key, count, value);
  }
  lremPromise(key, count, value) {
    return latte_lib['promise'].promisify(this.lrem.bind(this))(key, count, value);
  }
  /**
		set 添加
	*/
  sadd(key, value, callback) {
    this.connect.sadd(key, value, callback);
  }
	/**
		set 是否存在
	*/
  sismember(key, value, callback) {
    this.connect.sismember(key, value, callback);
  }
  /**
    set 查个数
  */
  scard(key, callback) {
    this.connect.scard(key, callback);
  }
  /**
		set 删除
	*/
  srem(key, value, callback) {
    this.connect.srem(key, value, callback);
  }
  /**
    set 差集
  */
  sdiff(key, setName, callback) {
    this.connect.sdiff(key, setName, callback);
  }
  /**
    set 差集个数
  */
  sdiffstore(key, setName, callback) {
    this.connect.sdiffstore(key, setName, callback);
  }
  /**
    set 交集
  */
  sinter(key, setName, callback) {
    this.connect.sinter(key, setName, callback);
  }
  /**
    set 交集个数
  */
  sinterstore(key, setName, callback) {
    this.connect.sinterstore(key, setName, callback);
  }
  /**
    set 并集
  */
  sunion(key, setName, callback) {
    this.connect.sunion(key, setName, callback);
  }
  /**
    set 并集个数
  */
  sunionstore(key, setName, callback) {
    this.connect.sunionstore(key, setName, callback);
  }
  /**
    set 查
  */
  smembers(key, callback) {
    this.connect.smembers(key, callback);
  }
  /**
    随机并删除
  */
  spop(key, callback) {
    this.connect.spop(key, callback);
  }
  /**
    随机返回
  */
  srandmember(key, callback) {
    this.connect.srandmember(key, callback);
  }

  smove(key, value, setName, callback) {
    this.connect.smove(key, value, setName, callback);
  }
  /**
    sortedSet 添加
  */
  zadd(key, k, score, callback) {
    this.connect.zadd(key, k, score, callback);
  }
  /**
    sortedSet 删除
  */
  zrem(key, k, callback) {
    this.connect.zrem(key, key, callback);
  }
  /**
    sortedSet 总个数
  */
  zcard(key, callback) {
    this.connect.zcard(key, callback);
  }
  /**
    sortedSet 查找
  */
  zscore(key, k, callback) {
    this.connect.zscore(key, k, callback);
  }

  zrange(key, min, max, WITHSCORES, callback) {
    this.connect.zrange(key, min, max, WITHSCORES, callback);
  }

  zrevrange(key, min, max, WITHSCORES, callback) {
    this.connect.zrevrange(key, min, max, WITHSCORES, callback);
  }

  zrevrangebyscore(key, min, max, WITHSCORES, callback) {
    this.connect.zrevrangebyscore(key, Math.max(min, max), Math.min(min, max), WITHSCORES, callback);
  }

  zrangebyscore(key, min, max, WITHSCORES, callback) {
    this.connect.zrangebyscore(key, min, max, WITHSCORES, callback);
  }

  zremrangebyscore(key, min, max, callback) {
    this.connect.zremrangebyscore(key, min, max, callback);
  }

  zremrangebyrank(key, min, max, callback) {
    this.connect.zremrangebyrank(key, min, max, callback);
  }
  keys(key, callback) {
    this.connect.keys(key, callback);
  }
}