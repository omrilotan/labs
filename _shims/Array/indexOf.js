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