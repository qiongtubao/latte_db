var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./sqlite3.json'));
let student = require('../object/student');
var testClass = latte_db.SQL.createClass("student", student);

describe('sqlite3', function () {
  it('deletePromise', function (done) {
    let c;
    sql.getConnectPromise().then(function (connect) {
      c = connect;
      return testClass.delPromise({
        id: 1
      })(connect);
    }).then(function (data) {
      console.log('delete', data);
    }).finally(function (err) {
      done();
      sql.back(c);
    });
  });
});