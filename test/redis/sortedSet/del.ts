import { RedisClass, VerifyProperty } from "../../../lib/redis/baseClass";
import { SortedSet } from "../../../lib/redis/class/sortedSet"

@RedisClass()
class MSortSet extends SortedSet {
    key: string = "sortedSet"

    @VerifyProperty({
        type: "string"
    })
    name: string;

    @VerifyProperty({
        type: "number"
    })
    age: number;
}
let sortSet = new MSortSet();

import { redis } from "../../../lib/index";
let db = redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    sortSet.delAll()(connect, (error, result) => {
        console.log(error, result);
    });
});