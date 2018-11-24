var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function ClassDecorator() {
    return function (target) {
        console.log("I am class decorator", target);
    };
}
function MethodDecorator() {
    return function (target, methodName, descriptor) {
        console.log("I am method decorator");
    };
}
function Param1Decorator() {
    return function (target, methodName, paramIndex) {
        console.log("I am parameter1 decorator");
    };
}
function Param2Decorator() {
    return function (target, methodName, paramIndex) {
        console.log("I am parameter2 decorator");
    };
}
function PropertyDecorator() {
    return function (target, propertyName, l) {
        console.log("I am property decorator", target, propertyName);
    };
}
var Hello = /** @class */ (function () {
    function Hello() {
    }
    Hello.prototype.greet = function (p1, p2) { };
    __decorate([
        PropertyDecorator()
    ], Hello.prototype, "greeting");
    __decorate([
        MethodDecorator(),
        __param(0, Param1Decorator()), __param(1, Param2Decorator())
    ], Hello.prototype, "greet");
    Hello = __decorate([
        ClassDecorator()
    ], Hello);
    return Hello;
}());
