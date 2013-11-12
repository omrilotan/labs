Element.prototype.removeEventListener = function (type, method /* useCapture */) {
    if (typeof this.detachEvent === "function") {
        this.detachEvent("on" + type, method);
    } else {
        this["on" + type] = null;
    }
};