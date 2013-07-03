var pageManager = (function (window) {
    var exports = {},
        callbacks = [],
        pop = function (event) {
            var i = 0,
                len = callbacks.length;
            for (; i < len; i++) {
                callbacks[i](event);
            }
        };
    if (typeof window.addEventListener === "function") {
        window.addEventListener("popstate", pop);
    } else if (typeof window.attachEvent === "function") {
        window.attachEvent("onpopstate", pop);
    } else {
        window.onpopstate = pop;
    }

    exports.go = function (name, data) {
        data = typeof data === "object" ? data : null;
        window.history.pushState(data, name, "#!/" + name);
        pop({
            state: data,
            timeStamp: (new Date()).getTime(),
            type: "popstate"
        });
        return this;
    };

    exports.listen = function (fn) {
        callbacks.push(fn);
        return this;
    };

    exports.back = function () {
        window.history.back();
        return this;
    };

    return exports;

}(window));