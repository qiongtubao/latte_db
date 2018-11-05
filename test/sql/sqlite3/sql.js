var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./sqlite3.json'));
let student = require('../object/student');
var testClass = latte_db.SQL.createClass("student", student);

describe('sqlite3', function () {

  it("add", function (done) {
    sql.getConnect(function (err, connect) {
      if (err) { console.log(err); return done(err); }
      connect.connect.all('select count(1) from student', (err, result) => {
        console.log(err, result);
        done();
      })

    });
  });


});