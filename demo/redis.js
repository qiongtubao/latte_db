var Redis = require("../index.js").redis;

Redis.bindDb("session", {
	"host": "192.168.16.67",
    "port": 6379,
    "database": 0,
    "password": "fuck",
    "maxPoolNum": 100,
    "idleTimeoutMillis": 30000,
    "minPoolNum": 10
});
Redis.session.command(function(err, client, dbcb) {
	client.keys("*", function(err, data) {
		console.log(err, data);
	});
});
