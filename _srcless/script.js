var srcless = (function (window, document) {
    var frame = function (wrapper) {
        this.wrapper = typeof wrapper === "string" ? document.querySelector(wrapper) : wrapper;
        this.frame = document.createElement('iframe');
        this.wrapper.appendChild(this.frame);
        this.win = this.frame.contentWindow;
        this.doc = this.frame.contentWindow.document;

        this.win.owner = {
            win: window,
            doc: document
        };
    };
    frame.prototype = {};

    return frame;
}(window, document));