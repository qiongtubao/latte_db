import { redis } from "../../../lib/index";
import connect from "../../../lib/redis/connect";
import { RedisClass, VerifyProperty } from "../../../lib/redis/baseClass";
import { Set } from "../../../lib/redis/class/set"

let db = redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
// let c = redis.types.Set.create('set',
//     {
//         type: "object",
//         properties: {
//             name: {
//                 type: "string",
//                 minLength: 1
//             },
//             age: {
//                 type: "integer",
//                 min: 0
//             }
//         }
//     });
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
    let o = c.create({
        name: "s",
        age: 1
    });

    c.add(o)(connect, (error, result) => {
        console.log(error, result);
    });
});
