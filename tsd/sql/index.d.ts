export interface Config {
    type: string;
}
export declare let sqlTypes: {
    mysql: {
        create: (config: any) => import("../utils/dao").Dao;
    };
    sqlite3: {
        create: (config: any) => import("../utils/dao").Dao;
    };
    postgresql: {
        create: (config: any) => import("../utils/dao").Dao;
    };
};
export declare function create(config: Config): any;
export declare function bindDB(name: any, config: Config): any;
export declare function getDB(name: any): any;
declare let createClass: any;
export { createClass };
