if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

window.CHAT = window.CHAT || {};

CHAT.events = (function () {
    var exports = {},
        ready = [],
        waiting = {};    // key: array

    exports.listen = function (eventName, action) {
        eventName = eventName.toLowerCase();
        // in case the event already fired
        if (ready.indexOf(eventName) !== -1) {
            action();
            return;
        }
        if (!waiting.hasOwnProperty(eventName)) {
            waiting[eventName] = [];    // create new array for this event
        }
        waiting[eventName].push(action);
    };
    exports.dispatch = function (eventName) {
        eventName = eventName.toLowerCase();
        if (waiting.hasOwnProperty(eventName)) {
            var now;
            while (waiting[eventName].length) {
                now = waiting[eventName].splice(0, 1);
                now();
            }
            delete waiting[eventName];
        }
        if (~ready.indexOf(eventName)) {
            ready.push(eventName);
        }
    };
    exports.drop = function (eventName) {
        eventName = eventName.toLowerCase();
        var location = ready.indexOf(eventName);
        if (location !== -1) {
            ready.splice(location, 1);
        }
    };
}());


(function (window, document, string_script, undefined) {
    var addScript = function (uri, callback) {
            var script = document.createElement(string_script);
            script.async = true;
            script.src = uri;

            if (typeof callback === "function") {
                script.onload = script.onreadystatechange = function () {
                    var rdyState = script.readyState;
                    if (!rdyState || /complete|loaded/.test(script.readyState)) {
                        callback();
                        script.onload = null;
                        script.onreadystatechange = null;
                    }
                };
            }
            document.body.appendChild(script);
        },
        init = function () {
            CHAT.notify("initiate chat service");
            if (typeof window.initChat === "function") {
                window.initChat();
            }
        },
        loadRespectively = function (array) {
            var i = 0,
                len = array.length,
                loadNext = function (array, i, init) {
                    i++;
                    if (i < array.length) {
                        addScript(array[i], function () {
                            loadNext(array, i, init);
                        });
                    } else {
                        init();
                    }
                };
            loadNext(array, -1, init);
        }([
            "http://localhost:8888/socket.io/socket.io.js",
            "js/Stencil.js",
            "js/helpers.js",
            "js/mystencil.js",
            "js/dom.js",
            "js/chat.js"
        ]);

}(window, document, "script"));