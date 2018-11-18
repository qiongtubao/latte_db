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
