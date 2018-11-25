import { BaseObject, BaseClass } from "../baseClass";
import { VerifyClass } from "latte_verify";
export declare class List implements BaseClass<BaseObject> {
    key: string;
    verifyObject: VerifyClass;
    push(g: any): (connect: any, callback: any) => void;
    size(): (connect: any, callback: any) => void;
    unshift(list: BaseObject): (connect: any, callback: any) => void;
    shift(): (connect: any, callback: any) => void;
    pop(): (connect: any, callback: any) => void;
    waitShift(): (connect: any, callback: any) => void;
    waitPop(): (connect: any, callback: any) => void;
    getAll(min?: number, max?: number): (connect: any, callback: any) => void;
    create(value: any): BaseObject;
    get(index: any): (connect: any, callback: any) => void;
    set(index: any, list: BaseObject): (connect: any, callback: any) => void;
    del(list: any, index?: number): (connect: any, callback: any) => void;
    delAll(): (connect: any, callback: any) => void;
}
