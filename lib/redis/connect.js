var Connect = function(connect) {
	this.connect = connect;
	this.lastError = null;
	var self = this;
	connect.on("error", function(err) {
		self.lastError = err;
		console.log(err);
	});
};
(function() {
	this.get = function(key, callback) {
		this.connect.get(key, callback);
	}
	this.getPromise = function(key) {
		return latte_lib.promise.functionToPromise(this.get.bind(this), key);
	}
	this.set = function(key, value, callback) {
		this.connect.set(key, value, callback);
	}
	this.setPromise = function(key, value) {
		return latte_lib.promise.functionToPromise(this.get.bind(this), key, value);
	}
	this.close = function() {
		this.connect.quit();
	}
	this.validate = function() {
		return this.connect && this.connect.stream && this.connect.stream._connecting;
	}
	this.hmset = function(key ,value, callback) {
		this.connect.hmset(key, value, callback);
	}
	this.hmget = function(key, ks, callback) {
		this.connect.hmget(key, ks, function(err, data) {
			if(err) {
				return callback(err);
			}
			var result = {};
			data.forEach(function(value, index) {
				if(value != null && value != "undefined") {
					result[ks[index]] = value;
				}
				
			});
			return callback(null, result);
		});
	}
	this.del = function(key, callback) {
		this.connect.del(key, callback);
	}
	this.rpush = function(key, value, callback) {
		this.connect.rpush(key, value, callback);
	}
	this.lpush = function(key, value, callback) {
		this.connect.lpush(key, value, callback);
	}
	/**
		阻塞等待list左侧数据
	*/
	this.llen = function(key, callback) {
		this.connect.llen(key, callback);
	}
	/**
		list获得数据
	*/
	this.lrange = function(key, start, end, callback) {
		this.connect.lrange(key , start, end, callback);
	}
	/**
		获得list左侧数据
	*/
	this.lpop = function(key, callback) {
		this.connect.lpop(key, callback);
	}
	/**
		获得list右侧数据
	*/
	this.rpop = function(key, callback) {
		this.connect.rpop(key, callback);
	}
	/**
		阻塞等待list左侧数据
	*/
	this.blpop = function(keys, timeout, callback) {
		keys.push(timeout);
		this.connect.blpop(keys, callback)
	}
	/**
		阻塞等待list右侧数据
	*/
	this.brpop = function(keys, timeout, callback) {
		keys.push(timeout);
		this.connect.brpop(keys, callback);
	}
	/**
		list获得
	*/
	this.lindex = function(key, index, callback) {
		this.connect.lindex(key, index, callback);
	}
	/**
		list修改
	*/
	this.lset = function(key, index, obj, callback) {
		this.connect.lset(key, index, obj, callback);
	}
	/**
		list删除
	*/
	this.lrem  = function(key, count, value, callback) {
		this.connect.lrem(key, count, value, callback);
	}

	/**
		set 添加
	*/
	this.sadd = function(key, value, callback) {
		this.connect.sadd(key, value, callback);
	}
	/**
		set 是否存在
	*/
	this.sismember = function(key, value, callback) {
		this.connect.sismember(key, value, callback);
	}
	/**
		set 查个数
	*/
	this.scard = function(key, callback) {
		this.connect.scard(key, callback);
	}
	/**
		set 删除
	*/
	this.srem = function(key, value, callback) {
		this.connect.srem(key, value, callback);
	}
	/**
		set 差集
	*/
	this.sdiff = function(key, setName, callback) {
		this.connect.sdiff(key, setName, callback);
	}
	/**
		set 差集个数
	*/
	this.sdiffstore = function(key, setName, callback) {
		this.connect.sdiffstore(key, setName, callback);
	}
	/**
		set 交集
	*/
	this.sinter = function(key, setName, callback) {
		this.connect.sinter(key, setName, callback);
	}
	/**
		set 交集个数
	*/
	this.sinterstore = function(key, setName, callback) {
		this.connect.sinterstore(key, setName, callback);
	}
	/**
		set 并集
	*/
	this.sunion = function(key, setName, callback) {
		this.connect.sunion(key, setName, callback);
	}
	/**
		set 并集个数
	*/
	this.sunionstore = function(key, setName, callback) {
		this.connect.sunionstore(key, setName, callback);
	}
	/**
		set 查
	*/
	this.smembers = function(key, callback) {
		this.connect.smembers(key, callback);
	}
	/**
		随机并删除
	*/
	this.spop = function(key, callback) {
		this.connect.spop(key, callback);
	}
	/**
		随机返回
	*/
	this.srandmember = function(key, callback) {
		this.connect.srandmember(key, callback);
	}

	this.smove = function(key, value, setName, callback) {
		this.connect.smove(key, value, setName, callback);
	}
	/**
		sortedSet 添加
	*/
	this.zadd = function(key, k, score, callback) {
		this.connect.zadd(key, k , score, callback);
	}
	/**
		sortedSet 删除
	*/
	this.zrem = function(key, k, callback) {
		this.connect.zrem(key , key, callback);
	}
	/**
		sortedSet 总个数
	*/
	this.zcard = function(key, callback) {
		this.connect.zcard(key , callback);
	}
	/**
		sortedSet 查找
	*/
	this.zscore = function(key, k, callback) {
		this.connect.zscore(key, k, callback);
	}

	this.zrange = function(key, min, max, WITHSCORES, callback) {
		this.connect.zrange(key, min, max, WITHSCORES, callback);
	}

	this.zrevrange = function(key, min, max, WITHSCORES, callback) {
		this.connect.zrevrange(key, min, max, WITHSCORES, callback);
	}

	this.zrevrangebyscore = function(key, min, max, WITHSCORES, callback) {
		this.connect.zrevrangebyscore(key, Math.max(min,max), Math.min(min,max), WITHSCORES, callback);
	}

	this.zrangebyscore = function(key, min, max, WITHSCORES, callback) {
		this.connect.zrangebyscore(key, min, max, WITHSCORES, callback);
	}

	this.zremrangebyscore = function(key, min, max, callback) {
		this.connect.zremrangebyscore(key, min, max, callback);
	}

	this.zremrangebyrank = function(key, min, max, callback) {
		this.connect.zremrangebyrank(key, min, max, callback);
	}

 }).call(Connect.prototype);
module.exports = Connect;