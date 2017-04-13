
(function() {
	this.create = function(config) {
		var glass = function(key, value) {
			this.key = key;
			this.data = value;
			this._data = value;
		};
		(function() {
			this.set = function(value) {
				try {
					value = latte_verify.verify(value, config);
				}catch(err) {
					console.log("string set error");
					return;
				}
				this.data = value;
			}
			this.get = function() {
				return this.data;
			}
			this.flush = function() {
				this._data = this.data;
			}
		}).call(glass.prototype);
		(function() {
			this.add = function(g) {
				return function(connect, callback) {

				}
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);