import { VerifyClass } from "latte_verify";
export interface BaseClass<T> {
    verifyObject: VerifyClass;
    create(...args: any[]): T;
}
export declare class BaseObject {
    data: any;
    private _data;
    verifyObject: VerifyClass;
    constructor(verifyObject: VerifyClass);
    set(data: any): boolean;
    flush(): void;
    toKey(): any;
    toJSON(): any;
}
export declare function RedisClass(target?: any): Function | any;
export declare function VerifyProperty(verify: any): (target: any, name: any) => void;
