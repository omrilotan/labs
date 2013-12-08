var origin = "Custom.less.css",
    destination = "C:/Users/Omri/AppData/Local/Google/Chrome/User Data/Default/User StyleSheets/Custom.css",
    parser = require("less").Parser(), // https://github.com/less/less.js
    fs = require("fs");


var write = function (str) {
    fs.writeFile(destination, str, function (error) {
        if (error) {
            console.log(error + "\n");
        }
        console.log("DONE");
    });
};

var parse = function (str) {
    parser.parse(str, function (obj, data) {
        write(data.toCSS());
    });
};

var read = function (file, callback) {
    fs.readFile(file, "utf8", function (error, result) {
        if (error) {
            console.log(error + "\n");
        } else {
            parse(result);
        }
    });
};

read(origin);