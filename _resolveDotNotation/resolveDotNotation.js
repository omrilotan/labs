var resolveDotNotation = function (string, context) {

    var globalObject = (function () {
        var returnValue = null;
        try {
            returnValue = window;
        } catch (e) {
            returnValue = global;
        } finally {
            return returnValue;
        }
    }());

    // if the context argument is missing, context is the global object
    context = typeof context === "object" ? context : globalObject;

    // seperate the dots (.) and create an array
    var array = string.trim().split("."),
                    object = context,    // object transformes through iteration
                    i = 0,
                    loops = array.length;

    // if dot notation is crazy - let javascript evaluate it
    if (loops > 4) {
        try {
            return eval("context." + string);
        } catch (e) {
            return;    // undefined
        }
    }

    // iterate over the dot notation members array
    for (; i < loops; i++) {
        if (typeof object === "object") {
            object = object[array[i]];    // look for next item in object iterator
        } else {

            // can not search on non object member
            return;    // undefined
        }
    }
    return object;
};


x = {
    y: {
        z: 1
    }
};

console.log(resolveDotNotation("x.y.z"));
//console.log(global.x);