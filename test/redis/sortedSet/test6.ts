function ClassDecorator() {
    return function (target) {
        console.log("I am class decorator", target);
    }
}
function MethodDecorator() {
    return function (target, methodName: string, descriptor: PropertyDescriptor) {
        console.log("I am method decorator");
    }
}
function Param1Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter1 decorator");
    }
}
function Param2Decorator() {
    return function (target, methodName: string, paramIndex: number) {
        console.log("I am parameter2 decorator");
    }
}
function PropertyDecorator() {
    return function (target, propertyName: string, l) {
        console.log("I am property decorator", target, propertyName);
    }
}

@ClassDecorator()
class Hello {
    @PropertyDecorator()
    greeting: string;


    @MethodDecorator()
    greet(@Param1Decorator() p1: string, @Param2Decorator() p2: string) { }
}