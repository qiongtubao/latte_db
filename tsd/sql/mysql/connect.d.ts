import SqlConnectProxy from '../connect';
import { Connect as MySqlConnect } from "mysql2";
export default class MySqlConnectProxy extends SqlConnectProxy<MySqlConnect> {
    constructor(connect: any);
    sql: (...args: any[]) => any;
    begin: (callback: any) => any;
    commit: (callback: any) => any;
    rollback: (callback: any) => any;
    close: () => void;
    addKey: (key: any, glassObject: any, result0: any, result1: any) => void;
}
