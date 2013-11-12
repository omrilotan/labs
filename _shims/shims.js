// Build Date: 2013-11-12

if (typeof String.prototype.trim !== "function"){
	String.prototype.trim = function trim () {
	    return this.replace(/^\s+|\s+$/g, "");
	};
}

if (typeof Array.prototype.forEach !== "function"){
	Array.prototype.forEach = function forEach (fn, scope) {
	    var i = 0,
	        len = this.length;
	    for(; i < len; ++i) {
	        fn.call(scope, this[i], i, this);
	    }
	};
}

if (typeof Element.prototype.matches !== "function"){
	Element.prototype.matches =
	        Element.prototype.matchesSelector ||
	        Element.prototype.mozMatchesSelector ||
	        Element.prototype.webkitMatchesSelector ||
	        Element.prototype.msMatchesSelector ||
	        Element.prototype.oMatchesSelector || function (query) {
	            var collection = document.querySelectorAll(query);
	            return [].indexOf.call(collection, this);
	        };
}

if (typeof Element.prototype.addEventListener !== "function"){
	Element.prototype.addEventListener = function (type, method /* useCapture */) {
	    if (typeof this.attachEvent === "function") {
	        this.attachEvent("on" + type, method);
	    } else {
	        this["on" + type] = method;
	    }
	};
}

if (typeof Element.prototype.removeEventListener !== "function"){
	Element.prototype.removeEventListener = function (type, method /* useCapture */) {
	    if (typeof this.detachEvent === "function") {
	        this.detachEvent("on" + type, method);
	    } else {
	        this["on" + type] = null;
	    }
	};
}

if (typeof Array.prototype.indexOf !== "function"){
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

if (typeof Object.prototype.hasOwnProperty !== "function"){
	Object.prototype.hasOwnProperty = function hasOwnProperty (property) {
	    var _prototype = this.__proto__ || this.constructor.prototype;
	    return (property in this) && (!(property in _prototype) ||
	            _prototype[property] !== this[property]);
	};
}

if (typeof Function.prototype.bind !== "function"){
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