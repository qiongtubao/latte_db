import { Dao } from "../utils/dao";
import * as hashClass from "./class/hash";
import * as listClass from "./class/list";
import * as setClass from "./class/set";
export interface Config {
    type: string;
    key: string;
    verify: any;
}
export declare let types: {
    Hash: typeof hashClass;
    List: typeof listClass;
    Set: typeof setClass;
};
export declare function createClass(config: Config): any;
export declare function bindDB(name: any, config: Config): Dao;
export declare function createDB(config: any): Dao;
export declare function getDB(name: any): Dao;
