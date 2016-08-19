var toArrayCommands = ["find"];
module.exports = function(collection, command, params, callback) {
	if(!this[collection] || !this[collection][command]) {
		return callback(new Error("doCommand params Error"))		
	}
	if(toArrayCommands.indexOf(command)) {
		params.push(callback);
		this[collection][command].apply(this[collection], params);
	}else{
		this[collection][command].apply(this[collection], params).toArray(callback);
	}
}