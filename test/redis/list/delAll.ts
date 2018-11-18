import * as latte_db from "../../../index";
import connect from "../../../lib/redis/connect";
let db = latte_db.default.redis.createDB({
    host: "127.0.0.1",
    port: 6379
});
let c = latte_db.default.redis.createClass({
    type: "list",
    key: "students",
    verify: {
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
    }
});

db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    c.delAll()(connect, (error, result) => {
        console.log(error, result);
    });
});
