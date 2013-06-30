var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    root = path.join(process.cwd(), ""),
    port = 1337,
    page = "one.html";

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
            filename += page;
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

console.log("Static file server running at\n  => http://127.0.0.1:" + port + "/\nCTRL + C to shutdown");