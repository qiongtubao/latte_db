"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var latte_verify_1 = require("latte_verify");
var TemplateClass = (function () {
    function TemplateClass(data) {
        this.data = data;
    }
    TemplateClass.prototype.toKey = function () {
        if (latte_lib.utils.isObject(this.data)) {
            return JSON.stringify(this.data);
        }
        else if (latte_lib.object.isLatteObject(this.data)) {
            return JSON.stringify(this.data);
        }
        else {
            return this.data;
        }
    };
    TemplateClass.prototype.toJSON = function () {
        return this.data.toJSON();
    };
    return TemplateClass;
}());
var Set = (function () {
    function Set(key, config) {
        this.key = key;
        this.verifyObejct = latte_verify_1.createVerifyClass(config);
    }
    Set.prototype.getAll = function () {
        var _this = this;
        return function (connect, callback) {
            connect.smembers(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.size = function () {
        var _this = this;
        return function (connect, callback) {
            connect.scard(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.union = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sunion(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data.map(function (d) {
                    return _this.create(d);
                }));
            });
        };
    };
    Set.prototype.unionSize = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sunionstore(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.inter = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sinter(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data.map(function (d) {
                    return _this.create(d);
                }));
            });
        };
    };
    Set.prototype.interSize = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sinterstore(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.diff = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sdiff(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data.map(function (d) {
                    return _this.create(d);
                }));
            });
        };
    };
    Set.prototype.diffSize = function (setName) {
        var _this = this;
        return function (connect, callback) {
            connect.sdiffstore(_this.key, setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.pop = function () {
        var _this = this;
        return function (connect, callback) {
            connect.spop(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, _this.create(data));
            });
        };
    };
    Set.prototype.rand = function () {
        var _this = this;
        return function (connect, callback) {
            connect.srandmember(_this.key, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, _this.create(data));
            });
        };
    };
    Set.prototype.move = function (g, setName) {
        var _this = this;
        return function (connect, callback) {
            connect.smove(_this.key, g.toKey(), setName, function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, data);
            });
        };
    };
    Set.prototype.has = function (g) {
        var _this = this;
        return function (connect, callback) {
            connect.sismember(_this.key, g.toKey(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                callback(null, !!data);
            });
        };
    };
    Set.prototype.del = function (g) {
        var _this = this;
        return function (connect, callback) {
            connect.srem(_this.key, g.toKey(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.warn("set deled ", _this.key, g.toKey());
                }
                callback(null, g);
            });
        };
    };
    Set.prototype.add = function (g) {
        var _this = this;
        return function (connect, callback) {
            connect.sadd(_this.key, g.toKey(), function (err, data) {
                if (err) {
                    return callback(err);
                }
                if (data == 0) {
                    console.warn("set added", _this.key, g.toKey());
                }
                callback(null, g);
            });
        };
    };
    Set.prototype.create = function (data) {
        try {
            data = this.verifyObejct.verify(data);
        }
        catch (err) {
            console.error(err);
            return null;
        }
        return new TemplateClass(data);
    };
    return Set;
}());
exports.Set = Set;
function create(key, config) {
    return new Set(key, config);
}
exports.create = create;
