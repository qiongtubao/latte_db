import { VerifyClass } from "latte_verify";
import Connect from "../connect";
import { BaseClass } from "../baseClass";
declare class BaseObject {
    data: any;
    private _data;
    verifyObject: VerifyClass;
    constructor(verifyObject: VerifyClass);
    set(data: any): boolean;
    flush(): void;
    toKey(): any;
    toJSON(): any;
}
export declare class Set implements BaseClass<BaseObject> {
    key: string;
    verifyObject: VerifyClass;
    getAll(): (connect: Connect, callback: any) => void;
    size(): (connect: any, callback: any) => void;
    union(setName: any): (connect: Connect, callback: any) => void;
    unionSize(setName: any): (connect: Connect, callback: any) => void;
    inter(setName: any): (connect: Connect, callback: any) => void;
    interSize(setName: any): (connect: Connect, callback: any) => void;
    diff(setName: any): (connect: Connect, callback: any) => void;
    diffSize(setName: any): (connect: Connect, callback: any) => void;
    pop(): (connect: any, callback: any) => void;
    rand(): (connect: any, callback: any) => void;
    move(g: any, setName: any): (connect: Connect, callback: any) => void;
    has(g: any): (connect: Connect, callback: any) => void;
    del(g: any): (connect: Connect, callback: any) => void;
    add(g: any): (connect: Connect, callback: any) => void;
    create(data: any): BaseObject;
}
export {};
