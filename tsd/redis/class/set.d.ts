import { VerifyClass } from "latte_verify";
import Connect from "../connect";
import { BaseClass, BaseObject } from "../baseClass";
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
