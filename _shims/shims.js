// Create shims for missing prototype functionality
(function (window) {
    var shim = function (type, name, method) {
        if (typeof window[type].prototype[name] !== "function") {
            window[type].prototype[name] = method;
        }
    };
    
    // String.prototype.trim
    shim("String", "trim", function trim () {
        return this.replace(/^\s+|\s+$/g, "");
    });
    
    shim("Array", "indexOf", function indexOf (what, i) {
        i = i || 0;
        var len = this.length;
        while (i < len) {
            if (this[i] === what) {
                return i;
            }
            ++i;
        }
        return -1;
    });
    
    // Array.prototype.forEach
    shim("Array", "forEach", function forEach (fn, scope) {
        var i = 0,
            len = this.length;
        for(; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    });

    // Array.prototype.reduce
    shim("Array", "reduce", function(callback, context) {
        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.reduce called on null or undefined");
        }
        if (isntFunction(callback)) {
            throw new TypeError(callback + " is not a function");
        }
        var i = 0,
            len = this.length,
            value,
            isValueSet = false;
        if (arguments.length > 1) {
            value = context;
            isValueSet = true;
        }
        for (; len > i; ++i) {
            if (this.hasOwnProperty(i)) {
                if (isValueSet) {
                    value = callback(value, this[i], i, this);
                } else {
                    value = this[i];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError("Reduce of empty array with no initial value");
        }
        return value;
    });

    // Object.prototype.hasOwnProperty
    shim("Object", "hasOwnProperty", function hasOwnProperty (property) {
        var _prototype = this.__proto__ || this.constructor.prototype;
        return (property in this) && (!(property in _prototype) ||
                _prototype[property] !== this[property]);
    });

    // Function.prototype.bind
    shim("Function", "bind", function (that) {
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
    });
}(window));