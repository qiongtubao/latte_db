"use strict";
exports.__esModule = true;
var latte_verify_1 = require("latte_verify");
var latte_lib_1 = require("latte_lib");
function RedisClass(target) {
    if (latte_lib_1.utils.isFunction(target)) {
        RedisClass()(target);
    }
    else if (latte_lib_1.utils.isObject(target)) {
        return function (classObject) {
            classObject.prototype.verifyObject = latte_verify_1.createVerifyClass(classObject);
        };
    }
    else if (latte_lib_1.utils.isString(target)) {
        if (target == "object") {
            return function (classObject) {
                if (!classObject.prototype.verifyObject) {
                    throw new Error("RedisClass 修饰器使用错误");
                }
                classObject.prototype.verifyObject = latte_verify_1.createVerifyClass({
                    type: "object",
                    properties: classObject.prototype.verifyObject
                });
            };
        }
        else {
            return function (classObject) {
                classObject.prototype.verifyObject = latte_verify_1.createVerifyClass({
                    type: target
                });
            };
        }
    }
    else {
        return function (classObject) {
            if (!classObject.prototype.verifyObject) {
                throw new Error("RedisClass 修饰器使用错误");
            }
            if (classObject.prototype.verifyObject.type == null) {
                classObject.prototype.verifyObject = latte_verify_1.createVerifyClass({
                    type: "object",
                    properties: classObject.prototype.verifyObject
                });
            }
            else {
                classObject.prototype.verifyObject = latte_verify_1.createVerifyClass(classObject.prototype.verifyObject);
            }
        };
    }
}
exports.RedisClass = RedisClass;
function VerifyProperty(verify) {
    return function (target, name) {
        target.verifyObject = target.verifyObject || {};
        target.verifyObject[name] = verify;
    };
}
exports.VerifyProperty = VerifyProperty;
