
import { create as hashClass } from "./class/hash";
// import stringClass from "./class/string"
// import listClass from "./class/list"
// import setClass from "./class/set"
// import sortedSetClass from "./class/sortedSet"
export interface Config {
  type: string
}

let types = {
  hash: hashClass
};

export function create(config: Config) {
  if (!types[config.type]) {
    console.error("no find ", config.type, "type");
    return null;
  }
  return types[config.type].create(config);
}
let redis = {

}
export function bindDB(name, config: Config) {
  let result = create(config);
  if (!result) {
    return result;
  }
  redis[name] = result;
  return result;
}
export function getDB(name) {
  return redis[name];
}

