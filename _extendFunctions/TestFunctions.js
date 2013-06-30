var functionAppendix = (function (window, undefined) {
     "use strict";
    var Test = function (test) {
        var testFunction = test;
        this.execute = function (method) {
            var saved = this[method];
            this[method] = function () {
                if (testFunction.apply(this, arguments)) {
                    return saved.apply(this, arguments);
                }
                return;
            };
        };
    };
    Test.prototype.attach = function (context, method) {
        if (typeof context === "string") {
            method = context;
            context = window;
        }
        this.execute.call(context, method);
    };

    var Prefix = function (test) {
        var addedFunction = test;
        this.execute = function (method) {
            var saved = this[method];
            this[method] = function () {
                addedFunction.apply(this, arguments);
                return saved.apply(this, arguments);
            };
        };
    };
    Prefix.prototype.attach = function (context, method) {
        if (typeof context === "string") {
            method = context;
            context = window;
        }
        this.execute.call(context, method);
    };

    var Suffix = function (test) {
        var addedFunction = test;
        this.execute = function (method) {
            var saved = this[method];
            this[method] = function () {
                var returnValue = saved.apply(this, arguments);
                addedFunction.apply(this, arguments);
                return returnValue;
            };
        };
    };
    Suffix.prototype.attach = function (context, method) {
        if (typeof context === "string") {
            method = context;
            context = window;
        }
        this.execute.call(context, method);
    };

    return {
        Test: Test,
        Prefix: Prefix,
        Suffix: Suffix
    };
}(window));

// $ = new functionAppendix.Test(function () { return true; });