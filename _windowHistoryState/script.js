var pageManager = (function (window) {
    var exports = {},
        callbacks = [],
        onPopState = function (event) {
            var i = 0,
                len = callbacks.length;
            event.timeStamp = event.timeStamp || (new Date()).getTime();
            event.type = event.type || "popstate";

            for (; i < len; i++) {
                callbacks[i](event);
            }
        },

        // combine objects
        combine = function () {
            var i = 0,
                len = arguments.length,
                combined = {},
                nue,
                key;
            for (; i < len; i++) {
                nue = arguments[i];
                for (key in nue) {
                    if (nue.hasOwnProperty(key)) {
                        combined[key] = nue[key];
                    }
                }
            }
            return combined;
        };

    // add the event listener
    if (typeof window.addEventListener === "function") {
        window.addEventListener("popstate", onPopState);
    } else if (typeof window.attachEvent === "function") {
        window.attachEvent("onpopstate", onPopState);
    } else {
        window.onpopstate = onPopState;
    }

    // simulate emitting the popstate event
    exports.state = function () {
        onPopState({ state: window.history.state });
        return this;
    };

    // Apply all window.history methods
    exports.push = function (data) {
        if (typeof data !== "object") {
            throw new Error("pageManager Error: pushing a state requires a data object");
        }
        window.history.pushState(data, data.name, "#!/" + data.name);
        onPopState({ state: data });
        return this;
    };
    exports.replace = function (data) {
        if (typeof data !== "object") {
            throw new Error("pageManager Error: replacing a state requires a data object");
        }
        window.history.replaceState(data, data.name, "#!/" + data.name);
        onPopState({ state: data });
        return this;
    };
    exports.back = function () {
        window.history.back();
        return this;
    };
    exports.forward = function () {
        window.history.forward();
        return this;
    };
    exports.go = function (num) {
        window.history.go(num);
        return this;
    };
    exports.getState = function () {
        return window.history.state;
    };
    exports.getLength = function () {
        return window.history.length;
    };

    // add data to current
    exports.add = function (data) {
        if (typeof data !== "object") {
            throw new Error("pageManager Error: adding to state requires a data object");
        }
        return this.replace(combine(window.history.state, data));
    };

    // add an event listener method to "popstate"
    exports.listen = function (fn) {
        callbacks.push(fn);
        return this;
    };

    return exports;

}(window));