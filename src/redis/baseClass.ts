import { VerifyClass, createVerifyClass } from "latte_verify"
import { utils } from "latte_lib"
import LatteClass from "latte_lib/object";
export interface BaseClass<T> {
    verifyObject: VerifyClass;
    create(...args): T;
}
export function RedisClass(target?): Function | any {
    if (utils.isFunction(target)) {
        RedisClass()(target);
    } else if (utils.isObject(target)) {
        return function (classObject) {
            classObject.prototype.verifyObject = createVerifyClass(classObject);
        }
    } else if (utils.isString(target)) {
        if (target == "object") {
            return function (classObject) {
                if (!classObject.prototype.verifyObject) {
                    throw new Error("RedisClass 修饰器使用错误")
                }
                classObject.prototype.verifyObject = createVerifyClass({
                    type: "object",
                    properties: classObject.prototype.verifyObject
                });
            }
        } else {
            return function (classObject) {
                classObject.prototype.verifyObject = createVerifyClass({
                    type: target
                });
            }
        }
    } else {
        return function (classObject) {
            if (!classObject.prototype.verifyObject) {
                throw new Error("RedisClass 修饰器使用错误")
            }
            if (classObject.prototype.verifyObject.type == null) {
                classObject.prototype.verifyObject = createVerifyClass({
                    type: "object",
                    properties: classObject.prototype.verifyObject
                });
            } else {
                classObject.prototype.verifyObject = createVerifyClass(classObject.prototype.verifyObject);
            }
        }
    }
}
export function VerifyProperty(verify) {
    return function (target, name) {
        target.verifyObject = target.verifyObject || {};
        target.verifyObject[name] = verify;
    }
}
