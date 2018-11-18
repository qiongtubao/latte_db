import mysql from "./mysql/index"
import sqlite3 from "./sqlite3/index"
import templateClass from "./templateClass";
import postgresql from "./postgresql/index";
export interface Config {
  type: string
}

export let sqlTypes = {
  mysql: mysql,
  sqlite3: sqlite3,
  postgresql: postgresql
}
export function create(config: Config) {
  if (!sqlTypes[config.type]) {
    console.error("no find ", config.type, "type");
    return null;
  }
  return sqlTypes[config.type].create(config);
}
let sqls = {

}
export function bindDB(name, config: Config) {
  let result = create(config);
  if (!result) {
    return result;
  }
  sqls[name] = result;
  return result;
}
export function getDB(name) {
  return sqls[name];
}

export let createClass = templateClass;
