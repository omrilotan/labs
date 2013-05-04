var helpers = window.helpers || {};

helpers.addListener = (function () {
    var condition = function (obj, event, func) {
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
    return function (obj, event, func) {
        if (condition(obj, event, func)) {
            addListenerFork(obj, event, func);
        }
        return obj;
    };
}());

(function (window) {
    var stencil = new Stencil({
        async: true,
        onready: function () {
            // alert someone!
        }
    });
    // sys-listener
    stencil.extend("sys-listener", function (node, value, dataitem) {
        // break up listener to event and function
        if (typeof value === "string" || listenerString.indexOf("=") !== -1 || typeof dataitem === "object") {
            var listenerArray = value.split("="),
                func = stencil.helpers.getValue(node, listenerArray[1], dataitem);
            if (typeof func === "function") {
                helpers.addListener(node, listenerArray[0], function (event) {
                    func.call(null, event, dataitem);
                });
            }
        }
        return node;
    });

    // sys-handle
    stencil.extend("sys-handle", function (node, value, dataitem) {
        // break up listener to event and function
        var func = stencil.helpers.getValue(node, value, dataitem);
        func.call(node);
        return node;
    });

    window.stencil = stencil;
}(window, undefined));


helpers.memory = {
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

helpers.chatConnection = (function () {
    var socket = io.connect('http://127.0.0.1:1337'),
        connected = false,
        registers = {};

    socket.on("service", function () {
        connected = true;
    });

    socket.on("message", function (data) {
        if (registers[data.id]) {
            registers[data.id].receive(data);
            registers[data.id].toggle(true);
        }
    });

    socket.on("chat", function (data) {
        registers[data.roomID] = new Chat("omri", data.roomID);
    });

    return {
        emit: function (target, message) {
            if (!connected) {
                alert("no connection");
                return false;
            }
            socket.emit("message", {
                id: target.id,
                name: target.name,
                message: message
            });
            return true;
        },
        // helpers.chatConnection.newChat()
        newChat: function () {
            socket.emit("newChat");
        }
    };
}());

(function (window, undefined) {
    var chatHolder = null,
        collection = [],
        log;

    Chat = function (name, id) {
        this.id = id;
        this.name = name;

        if (collection.indexOf(id) === -1) {
            collection.push(id);
        } else {
            return false;
        }
        var container = document.createElement("div");
        container.className = "chat " + helpers.memory.read("chatToggleState");

        if (chatHolder === null) {
            chatHolder = document.createElement("div");
            chatHolder.className = "chatHolder";
            document.body.appendChild(chatHolder);
        }

        chatHolder.appendChild(container);

        this.container = container;
        this.body = null;

        this.destroy = function () {
            collection.splice(collection.indexOf(this.id), 1);
        };

        // init
        var chat = this;
        stencil.append(this.container, "title", {
            toggleChat: function (evt) {
                evt = evt || window.event;
                var target = evt.target || evt.srcElement;
                if (target.tagName.toLowerCase() === "button") {
                    chat.kill();
                    return;
                }
                chat.toggle();
            },
            storeBody: function() {
                chat.body = this;
            },
            submitMessage: function (evt) {
                evt = evt || window.event;
                var target = evt.target || evt.srcElement,
                    input = target.querySelector("input");
                evt.preventDefault();

                var sent = chat.post(input.value);
                if (sent) {
                    input.value = "";
                    input.focus();
                }
            },
            name: "Chat " + this.id
        });
    };

    Chat.prototype = {};

    // post
    Chat.prototype.post = function (message) {
        if (message) {
            var sent = helpers.chatConnection.emit(this, message);
            if (sent) {
                stencil.append(this.body, "message", {
                    name: "me",
                    message: message
                });
                this.body.scrollTop = this.body.scrollHeight;
                return true;
            }
        }
        return false;
    };
    // receive
    Chat.prototype.receive = function (data) {
        stencil.append(this.body, "message", {
            name: data.name,
            message: data.message
        });
        this.body.scrollTop = this.body.scrollHeight;
    };
    // kill
    Chat.prototype.kill = function () {
        this.container.parentNode.removeChild(this.container);
        this.destroy();
    };
    // toggle
    Chat.prototype.toggle = function (bool) {
        if (bool === true) {
            this.container.classList.add("open");
            helpers.memory.write("chatToggleState", "open");
        } else {
            this.container.classList.toggle("open");
            helpers.memory.write("chatToggleState", (this.container.classList.contains("open") ? "open" : ""));
        }
    };

    window.Chat = Chat;
}(window));