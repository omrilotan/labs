if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        var i = 0,
            len = this.length;
        for(; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    }
}

window.CHAT = window.CHAT || {};

CHAT.conn = (function (window, document, io, CHAT, undefined) {
    
    // dependencies
    if (typeof io !== "object" ||
                typeof CHAT !== "object") {
        notify("dependency error");
        return;
    }

    var constants = {
            HOST: "http://localhost:8888"
        },
        activeRooms = [],
        socket = io.connect(constants.HOST),
        credentials = {},
        onlineUsers = [],    // array of key value pair
        notify = alert,
        exports = {};

    exports.initiate = function () {

        credentials.name = prompt("Login", "");

        var register = function () {
                socket.emit("register", credentials);
            },
            registerSucceeded = function () {
                notify(credentials.name + ", You are now connected.");
            },
            updateOnlineUsers = function (users) {
                onlineUsers = [];
                users.forEach(function (user) {
                    if (user !== credentials.name) {
                        onlineUsers.push({
                            key: user,
                            value: user
                        });
                    }
                });
                CHAT.interface.updateUsers(onlineUsers);
            },
            addOnlineUser = function (user) {
                onlineUsers.push({
                    key: user,
                    value: user
                });
                CHAT.interface.updateUsers(onlineUsers);
            },
            removeOnlineUser = function (user) {
                var i = onlineUsers.length;
                while (i--) {
                    if (onlineUsers[i].key === user) {
                        onlineUsers.splice(i, 1);
                    }
                }
                CHAT.interface.updateUsers(onlineUsers);
            },
            startListening = function (roomID, room) {
                socket.on(roomID, function (data) {
                    room.receive(data);
                });
            },
            createRoomSucceeded = function (data) {
                var room = new Room(data.roomID, "%room name%");
                startListening(data.roomID, room);
            },
            sendMessage = function (roomID, message) {
                socket.emit("chatMessage", {
                    roomID: roomID,
                    message: message,
                    senderName: credentials.name
                });
            },
            createRoomRequest = function (participantsList) {
                participantsList = participantsList;
                participantsList.push(credentials.name);
                socket.emit("createRoom", {
                    participants: participantsList
                });
            },
            errorMessage = function (message) {
                CHAT.notify(message);
            };
        socket.on("ready", register);
        socket.on("updateOnlineUsers", updateOnlineUsers);
        socket.on("addOnlineUser", addOnlineUser);
        socket.on("removeOnlineUser", removeOnlineUser);
        socket.on("createRoomSucceeded", createRoomSucceeded);
        socket.on("errorMessage", errorMessage);
        register();
        exports.createRoomRequest = createRoomRequest;
        exports.sendMessage = sendMessage;
    };

    return exports;
}(window, document, io, CHAT));