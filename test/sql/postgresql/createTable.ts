import { sql } from "../../../index"
let config = require("./db.json")

let db = sql.sqlTypes.postgresql.create(config);
let teacherClass = sql.createClass("nowTeacher", {
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
    teacherClass.createTable({
    })(connect, (err, data) => {
        console.log(err, data)
    });
});