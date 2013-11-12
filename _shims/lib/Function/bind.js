Function.prototype.bind = function bind (that) {
    if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var args = Array.prototype.slice.call(arguments, 1), 
        original = this, 
        dummy = function () {},
        bound = function () {
            return original.apply(this instanceof dummy && that ?
                    this : that,
                    args.concat(Array.prototype.slice.call(arguments)));
        };
    dummy.prototype = this.prototype;
    bound.prototype = new dummy();
    return bound;
};