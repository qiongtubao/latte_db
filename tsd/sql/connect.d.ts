export default class Connection {
    connect: any;
    constructor(connect: any);
    query: (tableName: string, wheres: object, options: object, callback: () => void) => void;
    update: (tableName: string, sets: any, wheres: any, callback: () => void) => void;
    add: (tableName: string, prototypes: any, callback: () => void) => void;
    del: (tableName: any, wheres: any, callback: () => void) => void;
    count: (tableName: any, wheres: any, options: any, callback: () => void) => void;
    createTable: (tableName: string, verify: object, options: object, callback: () => void) => void;
    sql: Function;
    begin: Function;
    commit: Function;
    rollback: Function;
    close: Function;
}
