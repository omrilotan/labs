exports.init = function () {
    var serv = new httpServer();
    serv.createConnection();
}

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var httpServer = function () {/*Constructor*/}

httpServer.prototype = {
    request: null,
    response: null,
    createConnection: function () {
       var funczish =  this._createServerCallBack.bind(this);
       http.createServer(funczish).listen(9999, "127.0.0.1");
    },
    _createServerCallBack: function (request, response) {
        this.request = request;
        this.response = response;
        this._handleRequest();
    },
    _handleRequest: function () {
        this.response.writeHead(200, { "Content-Type": "text/plain" });
        this.response.write("hello");
        this.response.end();
         console.log("Response delivered");
    }
}

