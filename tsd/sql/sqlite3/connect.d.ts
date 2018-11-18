import SqlConnectProxy from '../connect';
import { Connect as Sqlite3Connect } from "sqlite3";
export default class Sqlite3ConnectProxy extends SqlConnectProxy<Sqlite3Connect> {
    constructor(connect: any);
    sql: (...args: any[]) => any;
    begin: (callback: any) => void;
    commit: (callback: any) => void;
    rollback: (callback: any) => void;
    count: (tableName: any, wheres: any, options: any, callback: () => void) => void;
    query: (tableName: string, wheres: object, options: object, callback: () => void) => void;
    add: (tableName: string, prototypes: any, callback: (err: any, data?: any) => void) => void;
    close: () => void;
    addKey: (key: any, glassObject: any, result0: any, result1: any) => void;
}
