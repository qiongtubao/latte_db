import * as  latte_lib from 'latte_lib'
import SqlConnectProxy from '../connect'
import * as utils from '../utils'
import { Connect as Sqlite3Connect } from "sqlite3"
export default class Sqlite3ConnectProxy extends SqlConnectProxy<Sqlite3Connect> {
  constructor(connect) {
    super(connect);
  }
  sql = (...args) => {
    return this.connect.exec(...args);
  }
  begin = (callback) => {
    this.connect.exec("BEGIN TRANSACTION", callback);

  }
  commit = (callback) => {
    this.connect.exec("COMMIT TRANSACTION", callback);

  }
  rollback = (callback) => {
    this.connect.exec("ROLLBACK TRANSACTION", callback);
  }
  count = (tableName, wheres, options, callback: () => void) => {
    let sql = utils.countSql(tableName, wheres, options);
    console.log(sql);
    this.connect.all(sql, callback);
  }
  query = (tableName: string, wheres: object, options: object, callback: () => void) => {
    let sql = utils.querySql(tableName, wheres, options);
    this.connect.all(sql, callback);
  }
  add = (tableName: string, prototypes, callback: (err, data?) => void) => {
    let sql = utils.insertSql(tableName, prototypes);
    console.log(sql);
    this.connect.run(sql, function (err, data) {
      if (err) {
        return callback(err);
      }
      callback(err, this);
    });
  }
  close = () => {
    this.connect.close();
  }
  /**
   * @param result0 Statement{sql:string;lastID:number;changes:number} 
   */
  addKey = (key, glassObject, result0, result1) => {
    glassObject.set(key, result0.lastID);
    glassObject.flush();
  }
}