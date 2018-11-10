import { Dao } from "../utils/dao";
export interface Config {
    type: string;
    key: string;
    verify: any;
}
export declare function createClass(config: Config): any;
export declare function bindDB(name: any, config: Config): Dao;
export declare function createDB(config: any): Dao;
export declare function getDB(name: any): Dao;
