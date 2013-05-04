var httpServer = require("httpServer"),
    chatService = require("chatService"),
    io = require('socket.io'),
    app;

exports.init = function (base, port) {
    port = port || 1337;
    app = httpServer.init(base, 1337);
    chatService.init(app);

    console.log("Static file server running at\n  => http://127.0.0.1:" + port + "/\nCTRL + C to shutdown");
};