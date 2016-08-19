var toArrayCommands = ["find"];
module.exports = function(command, params, callback) {
	if(!this[command]) {
		return callback(new Error("doCommand params Error"));
	}
	switch(command) {
		case "multi":
			this.multi(params).exec(callback);
		break;
		default:
			params.push(callback);
			this[command].apply(this, params);
		break;
	}
}