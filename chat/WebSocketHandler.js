var socketsList = [];
var rooms = [];

var io = require('socket.io');
var http = require('http');
var port = 8888;

exports.init = function () {
    var serv = new socketServer();
    serv._createConnection();
};

var socketServer = function () { }; //*Constructor

socketServer.prototype = {

    _createConnection: function () {
        var app = http.createServer(function () { console.log("We are now connected to: " + port) });
        app.listen(port);
        //* socket.io register to http
        var socketConnection = io.listen(app);

        var bindOnConnected = this._connectEvent.bind(this);
        socketConnection.sockets.on('connection', bindOnConnected);
    },

    _connectEvent: function (socket) {

        //*NOTE: All callbacks use socket obj via closure

        console.log("***** connectEvent *****");

        socket.on("register", function (data) {
            console.log("***** register ******");

            socketsList[data.name] = socket;
            socket.userName = data.name;

            //* Retrieve list keys (names only, NO sockets)
            var onlineUsersList = [];
            for (var item in socketsList) {
                onlineUsersList.push(item);
            }
            
            socket.emit("registerSucceeded");
            socket.emit("updateOnlineUsers", onlineUsersList);

            //* Broadcast new user to all other active participants
            socket.broadcast.emit("addOnlineUser", data.name);
        });

        socket.on("chatMessage", function (data) {
            console.log("****** chatMessage ******");

            var participants = rooms[data.roomID].participants;
            for (var i in participants) {
                var recepientSocket = socketsList[participants[i]];
                if (recepientSocket) {
                    recepientSocket.emit(data.roomID, data);
                } else {
                    socket.emit("errorMessage", "socket " + participants[i] + " not found in socketsList")
                }
            }
        });

        socket.on("createRoom", function (data) {
            console.log("****** createRoom ******");

            var newRoomID = Math.floor(Math.random() * 1000);
            rooms[newRoomID] = { participants: data.participants };
            data.roomID = newRoomID;
            console.log("****** room id: " + data.roomID + "******");

            var participants = data.participants;
            for (var i in participants) {
                var recepientSocket = socketsList[participants[i]];
                if (recepientSocket) {
                    recepientSocket.emit("createRoomSucceeded", data);
                } else {
                    socket.emit("errorMessage", "socket " + participants[i] + " not found in socketsList")
                }
            }
        });

        socket.on('disconnect', function () {
            console.log("****** disconnect ******");
        
            delete socketsList[socket.userName];


            //* REFACTOR ********************
            //for (var key in rooms) {
            //    for (var part in rooms[key]) {
            //        if (part == socket.userName)
            //            console.log("****** remove part ******" + part);
            //            rooms[key].participants[part]= null;
            //    }
            //}
            socket.broadcast.emit("removeOnlineUser", socket.userName);
        });

        socket.emit("ready", true);
    }
};
