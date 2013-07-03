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



//////////////////////
/* get DOM elements */
//////////////////////
if (typeof document.getElementsByClassName !== "function") {
    document.getElementsByClassName = function(class_name) {
        var elementsArr = [],
            elements = this.all || this.getElementsByTagName("*"),
            pattern = new RegExp("(^|\\s)" + class_name + "(\\s|$)"),
            len = elements.length,
            i = 0;
        for(; i < len; i++) {
            if (pattern.test(elements[i].className)) {
                elementsArr.push(elements[i]);
            }
        }
        return elementsArr;
    }
}
// get all form elements within an element or in the body (default)
var getFormFields = function (e) {
    e = e || document.getElementsByTagName("body")[0];
    var elementsArr = [],
        tagsArray = ["input", "textarea", "select"],
        elements=e.getElementsByTagName("*"),
        len = elements.length,
        i = 0;
    for (; i < len; i++) {
        if (tagsArray.indexOf(elements[i].tagName.toLowerCase()) !== -1) {
            elementsArr.push(elements[i]);
        }
    }
    return elementsArr;
}
// get element by partial ID by specific tag or by all (default)
var findByPartialID = function (string, tag_name) {
    var arr = document.getElementsByTagName(tag_name),
        len = arr.length,
        i = 0;
    tag_name = tag_name || "*";
    for (; i < len; i++) {
        if (arr[i].id) {
            if (arr[i].id.indexOf(string) !== -1) {
                return arr[i];
            }
        }
    }
    return null;
}