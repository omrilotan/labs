var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    path = require("path"),
    root = path.join(process.cwd(), ""),
    port = 70;

process.argv.forEach(function(value, index, array) {
    if (index === 2) {
        port = value;
    }
});

http.createServer(function (request, response) {

    console.log("Requested file: " + request.url);
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
            filename += "index.html";
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
}).listen(port);

console.log("HTTP Server listening on port " + port + " from " + root);
