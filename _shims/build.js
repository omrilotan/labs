// dependencies
var fs = require("fs");

// operations
var entries = [],
    sum = 0,
    startShimming = function (obj) {
        console.log(obj);
        var key,
            nkey,
            items = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key) &&
                    typeof obj[key] === "object") {
                obj[key].forEach(function (item, index, array) {
                    sum++;
                    addEntry(key, item);
                });
            }
        }
    },
    addEntry = function (key, nkey) {
        console.log(key + "/" + nkey + ".js");
        fs.readFile(key + "/" + nkey + ".js",
                "utf8",
                function (error, result) {
                    entries.push("if (typeof " + key + ".prototype." + nkey + " === \"function\"){\r\n" + result + "\r\n}");
                    if (entries.length === sum) {
                        write(entries.join("\r\n\r\n"));
                    }
                });
    },
    write = function (code) {
        fs.writeFile("dist/shims.js", code, function (error) {
            if (error) {
                
            } else {
                console.log("file saved");
            }
        });
    };

var init = function () {
    fs.readFile("shims.json",
            "utf8",
            function (error, result) {
                startShimming(JSON.parse(result));
            });
};
init();
/*
fs.readFile(filename,
        "utf8", function (error, result) {
    //gather(error, result, index)
});
*/
/*
    fs.writeFile(destination, code, function (error) {
        if (error) {
            report(error);
        } else {
            report(destination + " file was saved");
        }
    });
*/


//operations.writeToFile("test/" + details.name + ".js", string);