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

var SqlObject = require("../../../lib/sql/sqlObject.js"); 
var sql = new SqlObject(Sql.mysql, "wp_wozllausers", { "ID": 1} );
sql.load(function(err) {
	console.log("error:",err);
	console.log(sql.data);
	sql.set("user_login", "dong");
	sql.save(function(error) {
		console.log("save", error);
	});
});
