import SqlConnectProxy from '../connect';
import { Connect as PostGreSqlConnect } from "pg";
export default class PostGreSqlConnectProxy extends SqlConnectProxy<PostGreSqlConnect> {
    constructor(connect: any);
    queryResultArray(data: any): any;
    sql: (...args: any[]) => any;
    begin: (callback: any) => any;
    commit: (callback: any) => any;
    rollback: (callback: any) => any;
    close: () => void;
    addKey: (key: any, glassObject: any, result0: any, result1: any) => void;
}
