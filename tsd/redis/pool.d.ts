import { Pool } from '../utils/pool';
interface Config {
    log: Function;
    port: number;
    host: string;
    password: string;
    database: number;
    maxPoolNum: number;
    idleTimeoutMills: number;
    minPoolNum: number;
}
export declare function createPool(redisConfig: Config): Pool;
export {};
