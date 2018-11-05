module.exports = {
  id: {
    type: "integer",
    key: 1
  },
  sn: {
    type: "string",
    unique: 1
  },
  children: {
    type: "object"
  },
  entryTime: {
    type: "date"
  }
}