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
let teacher = teacherClass.create({
    id: "1",
    name: "tubaoge",
    pwd: "@#$"
})
db.getConnect((err, connect) => {
    teacherClass.add(teacher)(connect, (err, data) => {
        console.log(err, data)
    });
});