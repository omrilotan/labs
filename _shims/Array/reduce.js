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