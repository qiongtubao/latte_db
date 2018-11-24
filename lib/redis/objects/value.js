"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValueDecorator(verify) {
    return function (target, pro) {
        target.value = target.value || {};
        target.value[pro] = verify;
    };
}
exports.ValueDecorator = ValueDecorator;
