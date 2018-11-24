import { VerifyClass } from "latte_verify";
export interface BaseClass<T> {
    verifyObject: VerifyClass;
    create(...args: any[]): T;
}
export declare function RedisClass(target?: any): Function | any;
export declare function VerifyProperty(verify: any): (target: any, name: any) => void;
