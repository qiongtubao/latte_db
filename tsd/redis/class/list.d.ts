export declare function toValue(v: any): any;
export default function create(key: any, config: any): {
    new (value: any): {
        data: any;
        _data: any;
        set(value: any): any;
        get(): any;
        flush(): void;
        toJSON(): any;
    };
    push(list: {
        data: any;
        _data: any;
        set(value: any): any;
        get(): any;
        flush(): void;
        toJSON(): any;
    }): (connect: any, callback: any) => void;
    size(): (connect: any, callback: any) => void;
    unshift(list: {
        data: any;
        _data: any;
        set(value: any): any;
        get(): any;
        flush(): void;
        toJSON(): any;
    }): (connect: any, callback: any) => void;
    shift(): (connect: any, callback: any) => void;
    pop(): (connect: any, callback: any) => void;
    waitShift(): (connect: any, callback: any) => void;
    waitPop(): (connect: any, callback: any) => void;
    getAll(min?: number, max?: number): (connect: any, callback: any) => void;
    create(value: any): {
        data: any;
        _data: any;
        set(value: any): any;
        get(): any;
        flush(): void;
        toJSON(): any;
    };
    get(index: any): (connect: any, callback: any) => void;
    set(index: any, list: any): (connect: any, callback: any) => void;
    del(list: any, index?: number): (connect: any, callback: any) => void;
    delAll(): (connect: any, callback: any) => void;
};
