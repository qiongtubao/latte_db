"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var SortedSetObject = (function () {
    function SortedSetObject(data, score) {
        this.data = data;
        this.score = score;
        this._score = score;
    }
    SortedSetObject.prototype.setScore = function (score) {
        this.score = score;
    };
    SortedSetObject.prototype.getScore = function () {
        return this.score;
    };
    SortedSetObject.prototype.getData = function () {
        if (latte_lib.utils.isObject(this.data)) {
            return JSON.stringify(this.data);
        }
        else if (latte_lib.object.isLatteObject(this.data)) {
            return JSON.stringify(this.data.data);
        }
        else {
            return this.data;
        }
    };
    SortedSetObject.prototype.flush = function () {
        this._score = this.score;
    };
    SortedSetObject.prototype.hasUpdate = function () {
        return this._score == this.score;
    };
    return SortedSetObject;
}());
var SortedSet = (function () {
    function SortedSet() {
    }
    SortedSet.prototype.update = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.zadd(_this.key, data.getData(), data.getScore(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                data.flush();
                callback(null, data);
            });
        };
    };
    SortedSet.prototype.del = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.zrem(_this.key, data.getScore(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(err, data);
            });
        };
    };
    SortedSet.prototype.delByIndex = function (min, max) {
        var _this = this;
        return function (connect, callback) {
            connect.zremrangebyrank(_this.key, min, max, function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(err, data);
            });
        };
    };
    SortedSet.prototype.delByScore = function (min, max) {
        var _this = this;
        return function (connect, callback) {
            connect.zremranggebyscore(_this.key, min, max, function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(err, data);
            });
        };
    };
    SortedSet.prototype.delAll = function () {
        var _this = this;
        return function (connect, callback) {
            connect.del(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                return callback(err, data);
            });
        };
    };
    SortedSet.prototype.getByIndex = function (start, end) {
        var _this = this;
        var method, min, max;
        if (start < 0 && end < 0) {
            if (start < end) {
                method = "zrange";
                min = start;
                max = end;
            }
            else {
                method = "zrevrange";
                max = start;
                min = end;
            }
        }
        else if (start > 0 && end > 0) {
            if (start < end) {
                method = "zrange";
                min = start;
                max = end;
            }
            else {
                method = "zrevrange";
                min = end;
                max = start;
            }
        }
        else {
            if (start > end) {
                method = "zrange";
                min = start;
                max = end;
            }
            else {
                method = "zrevrange";
                min = end;
                max = start;
            }
        }
        var self = this;
        return function (connect, callback) {
            connect[method](_this.key, min, max, "withscores", function (err, data) {
                if (err) {
                    return callback(err);
                }
                var result = [];
                for (var i = 0, len = data.length / 2; i < len; i++) {
                    var d = self.create(data[2 * i], data * i + 1);
                    result.push(d);
                }
                return callback(err, result);
            });
        };
    };
    SortedSet.prototype.getAll = function () {
        var _this = this;
        var self = this;
        return function (connect, callback) {
            connect.zrange(_this.key, 0, -1, "WITHSCORES", function (err, data) {
                if (err) {
                    return callback(err);
                }
                var result = [];
                for (var i = 0, len = data.length / 2; i < len; i++) {
                    var d = self.create(data[2 * i], data[2 * i + 1]);
                    result.push(d);
                }
                return callback(err, result);
            });
        };
    };
    SortedSet.prototype.getAllSize = function () {
        var _this = this;
        return function (connect, callback) {
            connect.zcard(_this.key, callback);
        };
    };
    SortedSet.prototype.getByScore = function (start, end) {
        var _this = this;
        var method, min, max;
        if (start < end) {
            method = "zrangebyscore";
            min = start;
            max = end;
        }
        else {
            method = "zrevrangebyscore";
            min = end;
            max = start;
        }
        var self = this;
        return function (connect, callback) {
            connect[method](_this.key, min, max, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var result = [];
                for (var i = 0, len = data.length / 2; i < len; i++) {
                    var d = self.create(data[2 * i], data[2 * i + 1]);
                    result.push(d);
                }
                return callback(err, result);
            });
        };
    };
    SortedSet.prototype.getByKey = function (mkey) {
        var _this = this;
        return function (connect, callback) {
            connect.zscore(_this.key, mkey, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var d = _this.create(mkey, data);
                return callback(null, d);
            });
        };
    };
    SortedSet.prototype.size = function (min, max) {
        var _this = this;
        return function (connect, callback) {
            connect.zcount(_this.key, min, max, "withscores", function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    SortedSet.prototype.add = function (data) {
        var _this = this;
        return function (connect, callback) {
            connect.zadd(_this.key, data.getScore(), data.getData(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    SortedSet.prototype.create = function (data, score) {
        var result;
        try {
            result = this.verifyObject.verify(data);
        }
        catch (err) {
            return null;
        }
        return new SortedSetObject(result, score);
    };
    return SortedSet;
}());
exports.SortedSet = SortedSet;
