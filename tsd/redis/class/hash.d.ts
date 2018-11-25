import Connect from "../connect";
declare class HashObject {
    key: string;
    value: any;
    private _value;
    constructor(key: any, value: any);
    getUpdates(): void;
    hasUpdate(): boolean;
    flush(): void;
    toJSON(): any;
}
export declare class Hash {
    crate(key: any, value: any): HashObject;
    add(t: HashObject): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
    del(t: HashObject): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
    update(t: HashObject): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
    get(key: string): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
    keys(key: any): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
}
export {};
