window.CHAT = window.CHAT || {};

// Helpers
// functions:
//     CHAT.helpers.addListener
//     CHAT.helpers.memory: read, write, remove
CHAT.helpers = (function (window, document, undefined) {
    var exports = {},
        condition = function (obj, event, func) {
            if (obj.nodeType !== 1 || typeof event !== "string" || typeof func !== "function") {
                return false;
            }
            return true;
        },
        addListenerFork = (function () {
            var condition = function (obj, event, func) {
                if (obj.nodeType !== 1 || typeof event !== "string" || typeof func !== "function") {
                    return false;
                }
                return true;
            };
            if (typeof document.addEventListener === "function") {
                return function (obj, event, func) {
                    if (condition(obj, event, func)) {
                        var events = event.split(","),
                            i = events.length;
                        while (i--) {
                            obj.addEventListener(events[i].trim(), func);
                        }
                    } else {
                        throwError("LISTENER", "event: " + event);
                    }
                    return obj;
                };
            } else if (typeof document.attachEvent === "function") {
                return function (obj, event, func) {
                    if (condition(obj, event, func)) {
                        var events = event.split(","),
                            i = events.length;
                        while (i--) {
                            obj.attachEvent(events[i].trim(), func);
                        }
                    } else {
                        throwError("LISTENER", "event: " + event);
                    }
                    return obj;
                };
            } else {
                return function (obj, event, func) {
                    if (condition(obj, event, func)) {
                        var events = event.split(","),
                            i = events.length;
                        while (i--) {
                            obj["on" + events[i].trim()] = func;
                        }
                    } else {
                        throwError("LISTENER", "event: " + event);
                    }
                    return obj;
                };
            }
        }());

    exports.addListener = function (obj, event, func) {
        if (condition(obj, event, func)) {
            addListenerFork(obj, event, func);
        }
        return obj;
    };

    exports.memory = {
        read: function (key) {
            return window.localStorage.getItem(key);
        },
        write: function (key, value) {
            return window.localStorage.setItem(key, value);
        },
        remove: function (key) {
            return window.localStorage.removeItem(key);
        }
    };

    // export
    return exports;
}(window, document));