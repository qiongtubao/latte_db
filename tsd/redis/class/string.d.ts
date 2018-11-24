import { VerifyClass } from "latte_verify";
import { BaseClass } from "../baseClass";
declare class BaseObject {
    verifyObject: VerifyClass;
    data: any;
    private _data;
    constructor(key: string, verifyObject: VerifyClass);
    setValue(data: any): boolean;
    flush(): void;
    hasUpdate(): boolean;
    toString(): string;
}
export declare class RedisString implements BaseClass<BaseObject> {
    key: string;
    verifyObject: VerifyClass;
    constructor(key: any, config: any);
    add(data: BaseObject): (connect: any, callback: any) => void;
    update(data: BaseObject): (connect: any, callback: any) => void;
    del(data: BaseObject): (connect: any, callback: any) => void;
    query(): (connect: any, callback: any) => void;
    create(value: any): BaseObject;
}
export default function (key: any, config: any): RedisString;
export {};
