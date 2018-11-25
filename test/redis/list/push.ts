import * as latte_db from "../../../lib/index";
import connect from "../../../lib/redis/connect";
import { RedisClass, VerifyProperty } from "../../../lib/redis/baseClass";
import { List } from "../../../lib/redis/class/list"
let db = latte_db.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
// let c = latte_db.default.redis.createClass({
//     type: "list",
//     key: "students",
//     verify: {
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
//     }
// });
@RedisClass
class MList extends List {
    key: string = 'list';
    @VerifyProperty({
        type: "string"
    })
    name: string;

    @VerifyProperty({
        type: "number"
    })
    age: number;
}
let c = new MList();
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
