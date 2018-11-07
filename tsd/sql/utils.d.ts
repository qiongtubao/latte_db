export declare function whereSql(wheres: any): string;
export declare function querySql(tableName: any, wheres: any, options: any): string;
export declare function updateSql(tableName: any, sets: any, wheres: any): string;
export declare function insertSql(tableName: any, prototypes: any): string;
export declare function delSql(tableName: any, wheres: any): string;
export declare function countSql(tableName: any, wheres: any, options: any): string;
interface tableOptions {
    engine?: string;
    charset?: string;
}
export declare function createTable(tableName: any, verify: any, options: tableOptions): string;
export {};
