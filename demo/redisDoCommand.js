var Redis = require("../index.js").redis;

Redis.bindDb("session", {
	"host": "192.168.1.25",
    "port": 6379,
    "database": 0,
    "maxPoolNum": 100,
    "idleTimeoutMillis": 30000,
    "minPoolNum": 10
});
Redis.session.doCommand("fuck", ["*"], function(err, data) {
	console.log(err, data);
});
