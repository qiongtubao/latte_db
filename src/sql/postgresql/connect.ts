import * as latte_lib from 'latte_lib'
import SqlConnectProxy from '../connect'
import { Connect as PostGreSqlConnect } from "pg"
export default class PostGreSqlConnectProxy extends SqlConnectProxy<PostGreSqlConnect> {
    constructor(connect) {
        super(connect);
    }
    queryResultArray(data) {
        return data.rows;
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