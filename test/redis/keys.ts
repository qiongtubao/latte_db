import * as latte_db from "../../index";
let db = latte_db.default.redis.getDB({
    host: "127.0.0.1",
    port: 6379
});
db.getConnect((err, connect) => {
    if (err) {
        return console.log(err);
    }
    connect.keys("*", (err, data) => {
        console.log(err, data);
    });
});
