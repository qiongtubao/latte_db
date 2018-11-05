var latte_db = require("../../../lib").default;
var latte_lib = require("latte_lib");

let sql = latte_db.SQL.bindDB("test", require('./mysql.json'));
let sn = require('../object/sn');
var testClass = latte_db.SQL.createClass("sn", sn);
describe('mysql', function () {
  it("sn", function (done) {
    sql.getConnect(function (err, connect) {
      if (err) { console.log(err); return; }
      testClass.count({
        entryTime: {
          $gt: Date.now() - 1000,
          $lt: Date.now() - 50
        },
        "children.1": {
          $gt: 1,
          $lt: 3
        }
      }, {
          limit: [0, 1]
        })(connect, function (err, data) {
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
        entryTime: {
          $gt: Date.now() - 1000,
          $lt: Date.now() - 50
        },
        "children.1": {
          $gt: 1,
          $lt: 3
        }
      }, {
          limit: [0, 1]
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