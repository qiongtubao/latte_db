import { sql } from "../../../index"
let config = require("./db.json")

let db = sql.sqlTypes.postgresql.create(config);
let teacherClass = sql.createClass("teacher", {
    id: {
        type: "string",
        key: 1
    },
    name: {
        type: "string"
    },
    pwd: {
        type: "string"
    }
})

db.getConnect((err, connect) => {
    teacherClass.del({
        id: "1"
    })(connect, (err, data) => {
        console.log(err, data)
    });
});