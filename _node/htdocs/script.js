var x = 10;

var y = function (cc) {
    console.log("going in " + arguments[0]);
    arguments[0] = "12";
    console.log("going out " + cc);
};

var a = function () {
    console.log("begin " + x);
    console.log("\n\n\n");
    y(x);
    console.log("\n\n\n");
    console.log("finally " + x);
};