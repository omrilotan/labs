var log = typeof console === "object" ? console.log : function (str) { alert(str); };

var car = function (name) {
    this.name = name || "car";
};
car.prototype.drive = function () {
    log(this.name + " goes vroom!");
};
var borderRed = function (element) {
    element.style.border = "2px solid red";
};


(function (window, undefined) {
    var Test = function (test) {
        var testFunction = test;
        this.execute = function (method) {
            var saved = this[method];
            this[method] = function () {
                if (testFunction.apply(this, arguments)) {
                    return saved.apply(this, arguments);
                }
                return;
            };
        };
    };

    Test.prototype.attach = function (context, method) {
        if (typeof context === "string") {
            method = context;
            context = window;
        }
        this.execute.call(context, method);
    };

    window.Test = Test;

}(window));


var myTest = new Test(function () {
    return arguments.length === 0;
});
var isDOMElement = new Test(function (element) {
    var isDOMElement = false;
    try {
        isDOMElement = element instanceof HTMLElement;
    } catch (e) {
        isDOMElement = (typeof element === 'object' &&
                        (element.nodeType === 1) &&
                        (typeof element.style === 'object') &&
                        (typeof element.ownerDocument === 'object'));
    }
    return isDOMElement;
});

myTest.attach(car.prototype, "drive");
isDOMElement.attach("borderRed");

borderRed(document.getElementById("foo"));

/* - Execute - */
var myCar = new car("My car");
var hisCar = new car("His car");
var aCar = new car();

myCar.drive();
hisCar.drive();
aCar.drive(2);
