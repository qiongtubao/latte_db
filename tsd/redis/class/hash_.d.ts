import * as latte_lib from "latte_lib";
import Connect from "../connect";
export declare function create(config: any): {
    new (key: string, data: any): {
        key: string;
        data: latte_lib.object;
        updateData: latte_lib.object;
        oldData: latte_lib.object;
        get(key: any): any;
        set(key: any, value: any): void;
        getUpdates(): any;
        getAll(): any;
        flush(): void;
        toJSON(): any;
    };
    crate(key: any, value: any): {
        key: string;
        data: latte_lib.object;
        updateData: latte_lib.object;
        oldData: latte_lib.object;
        get(key: any): any;
        set(key: any, value: any): void;
        getUpdates(): any;
        getAll(): any;
        flush(): void;
        toJSON(): any;
    };
    add(t: {
        key: string;
        data: latte_lib.object;
        updateData: latte_lib.object;
        oldData: latte_lib.object;
        get(key: any): any;
        set(key: any, value: any): void;
        getUpdates(): any;
        getAll(): any;
        flush(): void;
        toJSON(): any;
    }): (connect: any, callback?: (err: any, result?: any) => void) => void;
    del(t: {
        key: string;
        data: latte_lib.object;
        updateData: latte_lib.object;
        oldData: latte_lib.object;
        get(key: any): any;
        set(key: any, value: any): void;
        getUpdates(): any;
        getAll(): any;
        flush(): void;
        toJSON(): any;
    }): (connect: any, callback?: (err: any, result?: any) => void) => void;
    update(t: {
        key: string;
        data: latte_lib.object;
        updateData: latte_lib.object;
        oldData: latte_lib.object;
        get(key: any): any;
        set(key: any, value: any): void;
        getUpdates(): any;
        getAll(): any;
        flush(): void;
        toJSON(): any;
    }): (connect: any, callback?: (err: any, result?: any) => void) => void;
    get(key: string): (connect: any, callback?: (err: any, result?: any) => void) => void;
    keys(key: any): (connect: Connect, callback?: (err: any, result?: any) => void) => void;
};
