var Sql = require("../../../lib/index.js").sql;

Sql.bindDb("mysql", {
	"host": "192.168.1.25",
	"user": "root",
	"password": "root",
	"database": "wordpress",
	"type": "mysql",
	"maxPoolNum": 1,
    "idleTimeoutMillis": 30000,
    "minPoolNum": 1
});
Sql.mysql.command(function(err, client, dbcb) {
	console.log(err);
	client.query("wp_wozllausers", "*", function(err, data) {
		console.log(err, data);
	});
});
