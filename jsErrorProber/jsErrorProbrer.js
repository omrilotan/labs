/*!
 * jsErrorProber JavaScript Error Probrer v0.0.1
 * Documentation => http://watermelonbunny.github.com/jsErrorProber
 */
var jsErrorProber = function () {
    var that = this,
        view = document.documentElement.ownerDocument.defaultView || document.documentElement.ownerDocument.parentWindow,
        errorTypes = {
            "EVAL": EvalError, // an error that occurs regarding the global function eval()
            "RANGE": RangeError, // numeric variable or parameter is outside of its valid range
            "REFERENCE": ReferenceError, // de-referencing an invalid reference
            "REF": ReferenceError,
            "SYNTAX": SyntaxError, // a syntax error that occurs while parsing code in eval()
            "TYPE": TypeError, // a variable or parameter is not of a valid type
            "URI": URIError // encodeURI() or decodeURI() are passed invalid parameters
        },
        addError = function (name, message) {
            if (typeof name !== "string") {
                throw new TypeError("Error name (" + name + ") must be a string");
            }
            if (errorTypes.hasOwnProperty(name)) {
                throw new Error("Error name (" + name + ") is already taken");
            }
            var myName = name,
                defaultMessage = message || "";
            errorTypes[name] = function (message) {
                errorTypes[name].name = myName;
                errorTypes[name].message = message || defaultMessage;
            };
            errorTypes[name].prototype = new Error();
            errorTypes[name].prototype.constructor = errorTypes[name];
        },
        throwError = function (type, string) {
            type = typeof type === "string" ? type.toUpperCase() : type;
            err = errorTypes.hasOwnProperty(type) ? errorTypes[type] : Error;
            throw new err(string + "\n\n\n" + 'ERROR in ' + arguments.callee.caller.toString());
        };
    return {
        throwError: throwError
    };
};