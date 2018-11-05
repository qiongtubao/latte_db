var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./sqlite3.json'));
let student = require('../object/student');
var testClass = latte_db.SQL.createClass("student", student);

describe('sqlite3', function () {
  before(function (done) {
    sql.getConnect((err, connect) => {
      if (err) { console.log(err); return done(err); }
      testClass.createTable({})(connect, (err, data) => {
        sql.back(connect);
        done(err);
      });
    });
  });
  it("countPromise", function (done) {
    sql.getConnect(function (err, connect) {
      if (err) { console.log(err); return done(err); }
      testClass.count({})(connect, function (err, data) {
        console.log(err, data);
        sql.back(connect);
        done(err);
      });

    });
  });
  it("countPromise", function (done) {
    let c;
    sql.getConnectPromise().then((connect) => {
      c = connect;
      return testClass.countPromise({

      })(connect);
    }).then(function (data) {
      console.log('dddd', data);
      done();
    }).catch(function (err) {
      done(err);
    }).finally(function (e) {
      console.log(e);
      sql.back(c);
    });
  });

});