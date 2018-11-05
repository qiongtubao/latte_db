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
  it("add", function (done) {
    sql.getConnect(function (err, connect) {
      if (err) { console.log(err); return done(err); }
      let c = testClass.create({
        id: 1,
        name: "a",
        entryTime: Date.now()
      })
      testClass.add(c)(connect, function (err, data) {
        console.log(err, data);
        sql.back(connect);
        done(err);
      });

    });
  });
  it("addPromise", function (done) {
    let c;
    let d = testClass.create({
      id: 2,
      name: "b",
      entryTime: Date.now()
    })
    sql.getConnectPromise().then((connect) => {
      c = connect;
      return testClass.addPromise(d)(connect);
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