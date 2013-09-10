Array.prototype.forEach = function forEach (fn, scope) {
    var i = 0,
        len = this.length;
    for(; i < len; ++i) {
        fn.call(scope, this[i], i, this);
    }
};