var Sql = require("../../../lib/index.js").sql;

Sql.bindDb("mysql", {
	"host": "192.168.1.25",
	"user": "root",
	"password": "root",
	"database": "zhegedb",
	"type": "mysql",
	"maxPoolNum": 1,
    "idleTimeoutMillis": 30000,
    "minPoolNum": 1
});
Sql.mysql.command(function(err, client, dbcb) {
	console.log(err);
	client.query("2015/07/31-8488action", "*", function(err, data) {
		console.log(err, data);
	});
});
