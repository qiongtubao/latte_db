export declare class RedisObject {
    private value;
    private _value;
    key: string;
    private verifyObject;
    constructor(key: any, value: any, verifyObject: any);
    set(value: any): void;
    get(): any;
    flush(): void;
}
