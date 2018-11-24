import { VerifyClass } from "latte_verify";
import { BaseClass } from "../baseClass";
declare class SortedSetObject {
    data: any;
    score: number;
    private _score;
    constructor(data: any, score: any);
    setScore(score: any): void;
    getScore(): number;
    getData(): any;
    flush(): void;
    hasUpdate(): boolean;
}
export declare class SortedSet implements BaseClass<SortedSetObject> {
    key: string;
    verifyObject: VerifyClass;
    update(data: any): (connect: any, callback: any) => void;
    del(data: any): (connect: any, callback: any) => void;
    delByIndex(min: any, max: any): (connect: any, callback: any) => void;
    delByScore(min: any, max: any): (connect: any, callback: any) => void;
    delAll(): (connect: any, callback: any) => void;
    getByIndex(start: any, end: any): (connect: any, callback: any) => void;
    getAll(): (connect: any, callback: any) => void;
    getAllSize(): (connect: any, callback: any) => void;
    getByScore(start: any, end: any): (connect: any, callback: any) => void;
    getByKey(mkey: any): (connect: any, callback: any) => void;
    size(min: any, max: any): (connect: any, callback: any) => void;
    add(data: SortedSetObject): (connect: any, callback: any) => void;
    create(data: any, score: any): SortedSetObject;
}
export {};
