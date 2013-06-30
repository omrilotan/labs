(function (win, namespace, undefined) {
    var frame = function (wrapper) {
        this.wrapper = typeof wrapper === "string" ? document.querySelector(wrapper) : wrapper;
        this.frame = document.createElement('iframe');
        this.wrapper.appendChild(this.frame)
        this.doc = this.frame.contentWindow.document;
    };
    frame.prototype = {};

    win[namespace] = frame;
}(window, "srcless"));