// Build Date: 2013-11-12

if (typeof Array.prototype.indexOf === "function"){
	Array.prototype.indexOf = function indexOf (what, i) {
	    i = i || 0;
	    var len = this.length;
	    while (i < len) {
	        if (this[i] === what) {
	            return i;
	        }
	        ++i;
	    }
	    return -1;
	};
}

if (typeof String.prototype.trim === "function"){
	String.prototype.trim = function trim () {
	    return this.replace(/^\s+|\s+$/g, "");
	};
}

if (typeof Array.prototype.forEach === "function"){
	Array.prototype.forEach = function forEach (fn, scope) {
	    var i = 0,
	        len = this.length;
	    for(; i < len; ++i) {
	        fn.call(scope, this[i], i, this);
	    }
	};
}

if (typeof Object.prototype.hasOwnProperty === "function"){
	Object.prototype.hasOwnProperty = function hasOwnProperty (property) {
	    var _prototype = this.__proto__ || this.constructor.prototype;
	    return (property in this) && (!(property in _prototype) ||
	            _prototype[property] !== this[property]);
	};
}

if (typeof Array.prototype.reduce === "function"){
	Array.prototype.reduce = function reduce(callback, context) {
	    if (this === null || this === undefined) {
	        throw new TypeError("Array.prototype.reduce called on null or undefined");
	    }
	    if (typeof callback !=="function") {
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
	};
}

if (typeof Function.prototype.bind === "function"){
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
}