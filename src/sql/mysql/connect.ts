import latte_lib from 'latte_lib'
import Connect from '../connect'
export default class MySqlConnect extends Connect {
  constructor(connect) {
    super(connect);
  }
  sql = (...args) => {
    return this.connect.query(...args);
  }
  begin = (callback) => {
    return this.connect.beginTransaction(callback);
  }
  commit = (callback) => {
    return this.connect.commit(callback);
  }
  rollback = (callback) => {
    return this.connect.rollback(callback);
  }
  close = () => {
    this.connect.close();
  }
  addKey = (key, glassObject, result0, result1) => {
    glassObject.set(key, result0.insertId);
    glassObject.flush();
  }
}