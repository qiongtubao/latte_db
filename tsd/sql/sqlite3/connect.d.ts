import Connect from '../connect';
export default class Sqlite3Connect extends Connect {
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
