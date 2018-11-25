import Connect from "../connect";
declare class TemplateClass {
    data: any;
    constructor(data: any);
    toKey(): any;
    toJSON(): any;
}
export declare class Set {
    private verifyObejct;
    private key;
    constructor(key: any, config: any);
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
    create(data: any): TemplateClass;
}
export declare function create(key: any, config: any): Set;
export {};
