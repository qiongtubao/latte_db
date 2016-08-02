var Mongodb = require("../index.js").mongodb;

Mongodb.bindDb("pay", {
	"host": "121.201.8.151",
    "port": 27017,
    "database": "weixinServer1",
    "password": "qiongtubao",
    "user": "weixin",
    "collections": ["pay"],
    "maxPoolNum": 100,
    "idleTimeoutMillis": 30000,
    "minPoolNum": 10
});
Mongodb.pay.command(function(err, client, dbcb) {
	client.pay.find({}).toArray(function(err,result) {
		console.log(err, result);
	});
});
