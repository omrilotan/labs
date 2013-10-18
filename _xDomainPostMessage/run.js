var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    root = path.join(process.cwd(), ""),
    open = require("open"),
    port = 3;

var start = function (name, port) {
    http.createServer(function (request, response) {
        var filename = root + url.parse(request.url).pathname,
            errorHandler = function (error, code) {
                response.writeHead(code, {"Content-Type": "text/plain"});
                response.write(code + " \n" + error + " \n");
                response.end();
                return;
            };
        path.exists(filename, function(exists) {
            if (!exists) {
                errorHandler("Not Found", 404)
                return;
            }
            // for directories, serve the "index.html" file
            if (fs.statSync(filename).isDirectory()) {
                filename += name;
            }
            // read the file
            fs.readFile(filename, "binary", function(error, file) {
                if (error) {
                    errorHandler(error, 500)
                    return;
                }
                // finally, serve the desired file
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }).listen(port, "127.0.0.1");
    console.log("Static file server \"" + name + "\" running at\n  => http://127.0.0.1:" + port + "/\nCTRL + C to shutdown");
};


start("host.html", 10001);
start("guest.html", 10002);

open("http://127.0.0.1:10001/");