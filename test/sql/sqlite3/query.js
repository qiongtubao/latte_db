var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./sqlite3.json'));
let student = require('../object/student');
var testClass = latte_db.SQL.createClass("student", student);

describe('sqlite3', function () {

  it("query", function (done) {
    sql.getConnect(function (err, connect) {
      if (err) { console.log(err); return done(err); }
      testClass.query({})(connect, function (err, data) {
        console.log(err, data);
        sql.back(connect);
        done(err);
      });
    });
  });
  it('queryPromise', function (done) {
    let c;
    sql.getConnectPromise().then(function (connect) {
      c = connect;
      return testClass.queryPromise({})(connect);
    }).then(function (data) {
      console.log('dddd', data);
    }).finally(function (e) {
      done();
      sql.back(c);
    });

  });
});