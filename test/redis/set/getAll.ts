import { redis } from "../../../lib/index";
import connect from "../../../lib/redis/connect";

let db = redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
let c = redis.types.Set.create('set',
    {
        type: "object",
        properties: {
            name: {
                type: "string",
                minLength: 1
            },
            age: {
                type: "integer",
                min: 0
            }
        }
    });

db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    c.getAll()(connect, (error, result) => {
        console.log(error, result);
    });
});
