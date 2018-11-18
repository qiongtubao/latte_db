declare class DataClass {
    private data;
    private oldData;
    private updateData;
    private uniques;
    private _data;
    private key;
    private config;
    constructor(config: any, data: any, options: any);
    getData(): any;
    update(data: any): void;
    getWhere(): {};
    get(key: any): any;
    set(key: any, value: any): void;
    getUpdates(): {};
    flush(): void;
    toJSON(): any;
}
declare class TemplateClass {
    private tableName;
    private config;
    uniques: any;
    key: string;
    constructor(name: any, config: any);
    queryOnePromise(wheres: any, options: any): (connect: any) => any;
    queryOne(wheres: any, options: any): (connect: any, callback: any) => void;
    queryPromise(wheres: any, options: any): (connect: any) => any;
    query(wheres: any, options: any): (connect: any, callback: any) => void;
    updatePromise(wheres: any, update: any): (connect: any) => any;
    update(wheres: any, update: any): (connect: any, callback: any) => void;
    delPromise(wheres: any): (connect: any) => any;
    del(wheres: any): (connect: any, callback: any) => void;
    addPromise(data: any): (connect: any) => any;
    add(data: DataClass): (connect: any, callback: any) => void;
    createTable(options: any): (connect: any, callback: any) => void;
    create(data: any): DataClass;
    countPromise(data: any): (connect: any) => any;
    count(wheres: any): (connect: any, callback: any) => void;
}
declare const _default: (tableName: string, config: any) => TemplateClass;
export default _default;
