
import { Dao } from "../utils/dao"
import * as hashClass from "./class/hash";
import { createPool } from "./pool"
// import stringClass from "./class/string"
import * as listClass from "./class/list"
// import setClass from "./class/set"
// import sortedSetClass from "./class/sortedSet"
export interface Config {
  type: string,
  key: string,
  verify: any
}

let types = {
  hash: hashClass,
  list: listClass
};

export function createClass(config: Config) {
  if (!types[config.type]) {
    console.error("no find ", config.type, "type");
    return null;
  }
  return types[config.type].create(config.key, config.verify);
}
let redis = {

}
export function bindDB(name, config: Config) {
  let result = createDB(config);
  if (!result) {
    return result;
  }
  redis[name] = result;
  return result;
}
export function createDB(config: any): Dao {
  let db = new Dao(createPool, config);
  return db;
}
export function getDB(name): Dao {
  return redis[name];
}

