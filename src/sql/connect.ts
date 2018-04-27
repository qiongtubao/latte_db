import latte_lib from 'latte_lib';
import * as utils from './utils'
export default class Connection {
  connect: any;
  constructor(connect) {
    this.connect = connect;
  }
  query = (tableName: string, wheres: object, options: object, callback: () => void) => {
    let sql = utils.querySql(tableName, wheres, options);
    this.sql(sql, callback);
  }
  update = (tableName: string, sets, wheres, callback: () => void) => {
    let sql = utils.updateSql(tableName, sets, wheres);
    this.sql(sql, callback);
  }
  add = (tableName: string, prototypes, callback: () => void) => {
    let sql = utils.insertSql(tableName, prototypes);
    this.sql(sql, callback);
  }
  del = (tableName, wheres, callback: () => void) => {
    let sql = utils.delSql(tableName, wheres);
    this.sql(sql, callback);
  }
  count = (tableName, wheres, options, callback: () => void) => {
    let sql = utils.countSql(tableName, wheres, options);
    this.sql(sql, callback);
  }
  sql: Function;
  begin: Function;
  commit: Function;
  rollback: Function;
  close: Function;
}
