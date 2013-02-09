/*!
 * cordovaPluginManager version 1.1.2.1
 * 1. add plugins by name, with optional default vars and success & fail handlers
 * 2. call on added plugins with optional vars and success & fail handlers
 * https://github.com/watermelonbunny/cordovaPluginManager
 */
var cordovaPlugin = function (name) {
    var that = this,
        pluginName = name, // this name should co-respond with the Java plugin class
        constants = {
            'SCRIPT_NAME': 'cordova plugin manager',
            'ERROR_NO_NAME': 'can not register a Cordova plugin with no name',
            'ERROR_PRESERVED_WORD': 'function name my not be the string "add"',
            'NOT_READY': 'device not ready yet'
        },
        deviceReady = false, // default state
        log = (function () {
            var logFunction,
                hasUnObtrusiveMethod; // boolean
            return function (message, obtrusiveFallback) {
                if (hasUnObtrusiveMethod === undefined) {
                    // first run
                    hasUnObtrusiveMethod = console !== undefined && console.log !== undefined;
                    logFunction = hasUnObtrusiveMethod ? console.log : alert;
                }
                if (hasUnObtrusiveMethod || obtrusiveFallback) {
                    // log on unObtrusive method or fallback on obtrusive method
                    logFunction(message);
                }
                return false;
            };
        })(),
        handler = function (func) {
            // returns an empty function when function is missing
            return (typeof func === 'function') ? func : function () {};
        },
        initialNameCheck = function (name) {
            // these are must conditions for addind a function
            if (typeof name !== 'string') {
                throw new TypeError(constants.SCRIPT_NAME + ': ' + constants.ERROR_NO_NAME);
            }
            // lets not ruin our only function by accident. you can do this intentionally if you really want
            if (name === 'add') {
                throw new Error(constants.SCRIPT_NAME + ': ' + constants.ERROR_PRESERVED_WORD);
            }
            return name;
        },
        resolveArgs = function () {
            var args = arguments,
                i = 0,
                loops = args.length,
                handlers = [],
                variables = [];
            for (; i < loops; i++) {
                if (typeof args[i] === 'function') {
                    // functions are stored:
                    // [0] 1st will be used as success handler
                    // [1] 2nd will be used as fail handler
                    handlers.push(args[i]);
                } else {
                    // non function variables are stored as an array
                    variables.push(args[i]);
                }
            }
            // the return object takes care of defaults:
            return {
                vars: variables,
                success: handlers[0],
                fail: handlers[1]
            };
        },
        cordovaReady = false;
    // if the cordova event 'deviceready' did not fire, nothing should work
    document.addEventListener('deviceready', function () {
        deviceReady = true;
    }, false);
    that.add = function (/* name, var, ..., success, fail */) {
        var name = initialNameCheck(arguments[0]), // n
            defaultArgs = Array.prototype.slice.call(arguments, 1),
            defaults = resolveArgs.apply(null, defaultArgs); // apply is called since the defaultArgs is an array
        // add the function to the cordovaPlugin object
        that[name] = function (/* var, ..., success, fail */) {
            if (cordovaReady === false && typeof cordova === 'object' && typeof cordova.exec === 'function') {
                // always check if cordova is ready until it is
                cordovaReady = true;
            }
            // if the device is not ready yet, do not call the function
            if (deviceReady === false || cordovaReady === false) {
                log(constants.SCRIPT_NAME + ': ' + constants.NOT_READY);
                return false;
            }
            var options = resolveArgs.apply(null, arguments), // apply is called since the arguments is an array like object
                vars = (options.vars.length && options.vars.length !== 0 ? options.vars : false) || // false means move along
                       defaults.vars,
                success = (typeof options.success === 'function' ? options.success : false) || handler(defaults.success), // returns an empty function if needed
                fail = (typeof options.fail === 'function' ? options.fail : false) || handler(defaults.fail); // returns an empty function if needed
                // execute cordova plugin
                cordova.exec(success, fail, pluginName, name, vars);
        };
        return true;
    };
};
/*!
 * EXAMPLE:
 * var myPlugin = new cordovaPlugin("MyPlugin"); // MyPlugin is exposed plugin name on cordova
 * myPlugin.add("functionName", { success: function (result) { ... }, fail: function (result) { ... } });
 * myPlugin.functionName();
 * myPlugin.functionName('var', 'var', 'var', function (){ do something on success }, function (){ do something on fail });
 * myPlugin.anotherFunctionName();
 */