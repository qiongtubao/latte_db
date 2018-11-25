import { redis } from "../../../lib/index";
import connect from "../../../lib/redis/connect";
import { RedisClass, VerifyProperty } from "../../../lib/redis/baseClass";
import { Set } from "../../../lib/redis/class/set"
let db = redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
@RedisClass
class MSet extends Set {
    key: string = 'set';
    @VerifyProperty({
        type: "string"
    })
    name: string;

    @VerifyProperty({
        type: "number"
    })
    age: number;
}
let c = new MSet();

db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    c.getAll()(connect, (error, result) => {
        console.log(error, result);
    });
});
