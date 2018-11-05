var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./sqlite3.json'));
let student = require('../object/student');
var testClass = latte_db.SQL.createClass("student", student);

describe('sqlite3', function () {
  it('queryPromise', function (done) {
    // let c;
    // sql.getConnectPromise().then(function (connect) {
    //   c = connect;
    //   return testClass.queryPromise({})(connect);
    // }).then(function (data) {
    //   console.log('query', data);
    //   return testClass.updatePromise(data[0].set('name', 'c'))(connect);
    // }).then(function (data) {
    //   console.log('update', data);
    // }).finally(function (e) {
    //   done();
    //   sql.back(c);
    // });
    let c;
    sql.getConnectPromise().then(function (connect) {
      c = connect;
      return testClass.updatePromise({
        id: 1
      }, { name: "d" })(connect);
    }).then(function (data) {
      console.log('update', data);
    }).finally(function (err) {
      done();
      sql.back(c);
    });
  });
});