import Connect from '../connect';
export default class MySqlConnect extends Connect {
    constructor(connect: any);
    sql: (...args: any[]) => any;
    begin: (callback: any) => any;
    commit: (callback: any) => any;
    rollback: (callback: any) => any;
    close: () => void;
    addKey: (key: any, glassObject: any, result0: any, result1: any) => void;
}
