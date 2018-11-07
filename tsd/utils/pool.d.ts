import { RemoveIdle, Queue } from "latte_class";
export interface Config extends RemoveIdle.Config {
    database?: string;
    validate?: Function;
    name?: string;
    validateDelete?: Function;
    runTimeout?: number;
    minPoolNum?: number;
    maxPoolNum?: number;
    idleTimeoutMills?: number;
    create: Function;
    destroy: Function;
}
export declare class Pool extends RemoveIdle.RemoveIdle {
    count: number;
    waitingClients: Queue;
    drainging: boolean;
    validate: Function;
    validateDelete: Function;
    runTimeout: number;
    config: Config;
    _create: Function;
    constructor(config: Config);
    getSize: () => number;
    destroy: (obj: any) => void;
    dispense: () => any;
    createResource: () => void;
    acquire: (callback: any, priority?: any) => boolean;
    ensureMinimum: () => void;
    static create(config: Config): Pool;
}
