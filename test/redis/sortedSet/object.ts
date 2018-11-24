@SortedSet()
@RedisClass
export class DataClass {
    constructor(key) {

    }
    @value()
    name: string;
}

latte_db.redis.sortedSet.add()

import * as latte_db from "../../../index";
import connect from "../../../lib/redis/connect";
let db = latte_db.default.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
let c = new DataClass("hello");
let o = c.create({
    name: "dong",
    age: 12
});
db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    c.push(o)(connect, (error, data) => {
        console.log(err, data);
    });
});
