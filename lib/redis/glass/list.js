(function() {
	this.create = function(config) {
		var glass = function(key, value) {
			this.key = key;
			this.data = [];
		};
		(function() {
			this.push = function() {

			}
		}).call(glass.prototype);
		(function() {
			this.push = function(g) {
				return function(connect, callback) {

				}
			}
		}).call(glass);
		return glass;
	}
}).call(module.exports);