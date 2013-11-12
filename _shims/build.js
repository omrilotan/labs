// dependencies
var fs = require("fs");

// operations
var entries = ["// Build Date: " + (function (date) {
            var toDoubleDigit = function (num) {
                return num < 10 ? "0" + num : "" + num;
            };
            return date.getFullYear() + "-" +
                    toDoubleDigit(date.getMonth() + 1) + "-" +
                    toDoubleDigit(date.getDate());
        }((new Date)))],
    sum = 0,
    startShimming = function (obj) {
        console.log(obj);
        var key,
            nkey,
            items = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key) &&
                    typeof obj[key].forEach === "function") {
                obj[key].forEach(function (item, index, array) {
                    sum++;
                    addEntry(key, item);
                });
            } else {
                console.log(key + " is not an array")
            }
        }
    },
    addEntry = function (key, nkey) {
        console.log(key + "/" + nkey + ".js");
        fs.readFile("lib/" + key + "/" + nkey + ".js",
                "utf8",
                function (error, result) {
                    // add one indentation level
                    result = "\t" + result.replace(/\n/gmi, "\n\t");
                    entries.push("if (typeof " + key + ".prototype." + nkey + " === \"function\"){\r\n" + result + "\r\n}");
                    if (entries.length === sum) {
                        write(entries.join("\r\n\r\n"));
                    }
                });
    },
    write = function (code) {
        fs.writeFile("shims.js", code, function (error) {
            if (error) {
                
            } else {
                console.log("file saved");
            }
        });
    };

var init = function () {
    fs.readFile("list.json",
            "utf8",
            function (error, result) {
                startShimming(JSON.parse(result));
            });
};
init();