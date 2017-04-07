(function() {
	var thunkToPromise = this.thunkToPromise = function (fn) {
        var self = this;
        return new Promise(function (resolve, reject) {
            fn.call(self, function (err, res) {
                if (err) return reject(err);
                if (arguments.length > 2) res = slice.call(arguments, 1);
                resolve(res);
            });
        });
    };
    var slice = Array.prototype.slice;
    var FunctionToPromise = this.FunctionToPromise = function (fn) {
        var self = this;
        var args = slice.call(arguments, 1);
        return thunkToPromise(function (cb) {
            args.push(cb);
            fn.apply(self, args);
        });
    };
}).call(module.exports);