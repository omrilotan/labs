/*!
 * SPHistory v0.0.0
 */
var SPHistory = (function (window, undefined) {
    "use strict";
    var StateManager,    // Constructor
        history,
        remember,
        addons = {};

    // Get history from localStorage || Create new array
    history = (function () {
        var stored = localStorage.getItem("history");
        return stored !== null ? JSON.parse(stored) : [];
    }());

    remember = function (name, data) {
        
        // if history is empty
        if (history.length === 0) {
            history.push({ name: name, data: data });
        }

        // if page is different last location
        if (history[history.length - 1].name !== name) {
            history.push({ name: name, data: data });
        }

        // Store new history
        localStorage.setItem("history", JSON.stringify(history));
    };

    // Constructor
    StateManager = function () {};

    // >put
    StateManager.prototype.go = function (name, data) {
        
        // Go to page and push history state
        window.history.pushState(data, name, "#!" + name);
    };

    // get window.history.state
    StateManager.prototype.replace = function (name, data) {

        // Go to page and push history state
        window.history.replaceState(data, name, "#!" + name);
    };

    // create suffix for remembering states
    addons.andRemember = new functionAppendix.suffix(remember);
    addons.andRemember.attach(StateManager.prototype, "go");
    addons.andRemember.attach(StateManager.prototype, "replace");

    // Create a test for the remember function
    addons.stateArgsTest = new functionAppendix.Test(function () {
        var isValid = false;
        if (arguments.length === 2 &&
            typeof arguments[0] === "string") {
            isValid = true;
        }
        return isValid;
    });
    addons.stateArgsTest.attach(StateManager.prototype, "go");

    window.SPHistory = new StateManager();
}(window));