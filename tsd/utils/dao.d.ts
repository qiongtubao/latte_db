import { Pool, Config as PoolConfig } from "./pool";
export declare class Dao {
    pool: Pool;
    config: PoolConfig;
    log: Function;
    constructor(poolFunc: Function, config: any);
    quit(callback?: () => void): void;
    back(client: any): void;
    getConnect(callback?: (err: any, client: any) => void): void;
    getConnectPromise(...args: any[]): any;
    info: () => {
        name: string;
        poolSize: number;
        availableObjectsCount: any;
        waitingClientsCount: any;
    };
    getDb: () => string;
}
