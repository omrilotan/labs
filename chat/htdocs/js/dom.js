window.CHAT = window.CHAT || {};

// Notifications
CHAT.notify = (function (window, document, undefined) {
    var style = document.createElement("style"),
        styles = [
            ".notification {",
            "position:absolute;",
            "bottom:10px;",
            "left:50%;",
            "margin-left:-105px;",
            "width:200px;",
            "font:normal .75em sans-serif;",
            "min-height:1em;",
            "text-align:center;",
            "white-space:pre-line;",
            "background:#333;",
            "color:#eee;",
            "border:solid 1px #999;",
            "border-radius:.5em;",
            "padding:.25em 5px;",
            "box-shadow:2px 2px 4px rgba(0, 0, 0, .5);",
            "}"
        ].join("\n"),
        stylesNode = document.createTextNode(styles),
        notification,
        timer,
        br,
        remove = function () {
            document.body.removeChild(notification);
            notification = null;
            timer = 0;
        },
        exports = function (message) {
            if (!notification) {
                notification = document.createElement("div"),
                notification.className = "notification";
                notification.onclick = remove;
                document.body.appendChild(notification);
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(remove, 2000);

            var node = document.createTextNode(message);
            notification.appendChild(node);
            br = document.createElement("br");
            notification.appendChild(br);
        };

    // append styles to the document
    style.appendChild(stylesNode);
    document.head.appendChild(style);

    // export
    return exports;
}(window, document));

CHAT.interface = (function (window, document, undefined) {
    var exports = {},
        select,
        getSelectedOptions = function (select) {
            var options = select.getElementsByTagName("option"),
                i = 0,
                len = options.length,
                array = [];
            for (; i < len; i++) {
                if (!!options[i].selected) {
                    array.push(options[i].value);
                }
            }
            return array;
        },
        templateData = {
            buttonText: "Log in Chat",
            buttonHandler: function () {
                CHAT.conn.initiate();
                CHAT.stencil.stipple("#chatInterface", "chatinterface", {
                        startChatText: "Start new chat",
                        newChat: function () {
                            CHAT.conn.createRoomRequest(getSelectedOptions(select));
                        }});
                select = document.getElementById("chat-interface-users-list");
            }
        };
    exports.updateUsers = function (list) {
        select.innerHTML = "";
        while (list.length) {
            CHAT.stencil.append("#chat-interface-users-list", "chatinterface-user", list.pop());
        }
    };
    exports.init = function () {
        CHAT.stencil.append("#chatInterface", "chatinterface-login", templateData);
    };
    return exports;
}(window, document));

CHAT.Room = (function (window, document, undefined) {
    var chatHolder = null;

    Room = function (id, name) {
        this.id = id;
        this.name = name;

        var container = document.createElement("div");
        container.className = "chat " + (CHAT.helpers.memory.read("chatToggleState") || "");

        if (chatHolder === null) {
            chatHolder = document.createElement("div");
            chatHolder.className = "chat-widget outerWrap";
            document.body.appendChild(chatHolder);
        }

        chatHolder.appendChild(container);

        this.container = container;
        this.body = null;
        this.messagesContainer = null;

        this.destroy = function () {
            // TODO: implement
        };

        // init
        var chat = this;
        CHAT.stencil.append(this.container, "chatroom", {
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
            storeMessagesContainer: function () {
                chat.messagesContainer = this;
            },
            submitMessage: function (evt) {
                evt = evt || window.event;
                evt.preventDefault();
                var target = evt.target || evt.srcElement,
                    input = target.querySelector("input");
                    
                var sent = chat.post(input.value);
                if (sent) {
                    input.value = "";
                    input.focus();
                }
            },
            name: "Chat " + this.name + " ID: " + this.id
        });
    };

    var adjustHeights = function () {
        var diff = this.body.offsetHeight - this.messagesContainer.offsetHeight;
        if (diff > 0) {
            this.messagesContainer.style.marginTop = diff + "px";
        } else {
            this.messagesContainer.style.marginTop = 0;
        }
    };

    Room.prototype = {};

    // post
    Room.prototype.post = function (message) {
        if (message) {
            CHAT.conn.sendMessage(this.id, message);
            return true;
        }
        return false;
    };
    // receive
    Room.prototype.receive = function (data) {
        this.container.classList.add("open");
        CHAT.stencil.append(this.messagesContainer, "message", {
            name: data.senderName,
            message: data.message
        });
        adjustHeights.call(this);
        this.body.scrollTop = this.body.scrollHeight;
    };
    // kill
    Room.prototype.kill = function () {
        this.container.parentNode.removeChild(this.container);
        this.destroy();
    };
    // toggle
    Room.prototype.toggle = function (bool) {
        if (bool === true) {
            this.container.classList.add("open");
            CHAT.helpers.memory.write("chatToggleState", "open");
        } else {
            this.container.classList.toggle("open");
            CHAT.helpers.memory.write("chatToggleState", (this.container.classList.contains("open") ? "open" : ""));
        }
    };

    return Room;
}(window, document));


//    var chatInterface = document.getElementById("chatInterface");