/*
// Usage
//
// addResource("styles-text", @String css);
// addResource("script-text", @String script);
// addResource("styles-file", @String URL, @Function callback);
// addResource("script-file", @String URL, @function callback);
// addResource("styles-files", @Array URLs, @Function callback);
// addResource("script-files", @Array URLs, @function callback);
// addResource("styles-rules", @Object styles);
//
// Styles rules object example: {
//     ".myDiv": "color:blue; border:1px solid green;"
// }
*/

var addResource = (function __addResource__ (doc) {
    "use strict";
    var setArrtibute,
        forkSetArrtibute = function addResource$_forkSetArrtibute (element) {
            if (typeof element.setAttribute === "function") {
                return function addResource$_setArrtibute (element, name, value) {
                    element.setAttribute(name, value);
                };
            } else {
                return function addResource$_setArrtibute (element, name, value) {
                    element[name] = value;
                };
            }
        },
        setAttributes = function addResource$_setAttributes (element, attributes) {
            var name;
            setArrtibute = typeof setArrtibute === "function" ? setArrtibute : forkSetArrtibute(element);
            for (name in attributes) {
                if (attributes.hasOwnProperty(name)) {
                    setArrtibute(element, name, attributes[name]);
                }
            }
            return element;
        },
        addRule = function addResource$_addRule (sheet, selector, rules) {
            if (typeof sheet.insertRule === "function") {
                sheet.insertRule(selector + "{" + rules + "}", 1);
            } else if (typeof sheet.addRule === "function") {
                sheet.addRule(selector, rules, 1);
            } else {
                sheet.appendChild(doc.createTextNode(selector + "{" + rules + "}"));
            }
        },
        CSS = {
            create: function addResource$_CSS$create (url) {
                var element = doc.createElement("link"),
                    attributes = {
                        "type": "text/css"
                    };
                if (typeof url === "string") {
                    attributes["rel"] = "stylesheet";
                    attributes["href"] = url;
                }
                setAttributes(element, attributes);
                return element;
            },
            element: function addResource$_CSS$element (content) {
                var element = document.createElement("style");
                if (typeof content === "string") {
                    if (typeof element.styleSheet === "object") {
                        element.styleSheet.cssText = content;
                    } else {
                        element.appendChild(doc.createTextNode(content));
                    }
                }
                doc.head.appendChild(element);
            },
            rules: function addResource$_CSS$rules (content) {
                var sheet,
                    name;
                if (typeof doc.styleSheets === "object" &&
                        doc.styleSheets.length > 0) {
                    sheet = doc.styleSheets[0];
                } else {
                    sheet = CSS.create();
                    doc.head.appendChild(sheet);
                }
                for (name in content) {
                    if (content.hasOwnProperty(name)) {
                        addRule(sheet, name, content[name]);
                    }
                }
            },
            reference: function addResource$_CSS$reference (content, callback) {
                var element = CSS.create(content);
                element.onload = callback;
                doc.head.appendChild(element);
            },
            references: function addResource$_CSS$references (array, callback) {
                var loaded = 0;
                array.forEach(function addResource$_CSS$referencesArray (item) {
                    CSS.reference(item, function addResource$_CSS$referencesAdd () {
                        loaded++;
                        if (loaded === array.length && typeof callback === "function") {
                            callback();
                        }
                    });
                });
            }
        },
        JS = {
            create: function addResource$_JS$create (url) {
                var element = doc.createElement("script"),
                    attributes = {
                        "type": "text/javascript"
                    };
                if (typeof url === "string") {
                    attributes["src"] = url;
                }
                setAttributes(element, attributes);
                return element;
            },
            element: function addResource$_JS$element (content) {
                var element = JS.create();
                try {
                    element.appendChild(doc.createTextNode(content));
                } catch (e) {
                    element.text = content;
                }
                doc.head.appendChild(element);
            },
            reference: function addResource$_JS$reference (content, callback) {
                var element = JS.create(content);
                element.onload = callback;
                doc.head.appendChild(element);
            },
            references: function addResource$_JS$references (array, callback) {
                var loaded = 0;
                array.forEach(function addResource$_JS$referencesArray (item) {
                    JS.reference(item, function addResource$_JS$referencesAdd () {
                        loaded++;
                        if (loaded === array.length && typeof callback === "function") {
                            callback();
                        }
                    });
                });
            }
        },
        exports = function addResource (type, content, callback) {
            switch (type) {
                case "styles-text":    // append new styles element
                    CSS.element(content);
                    break;
                case "script-text":    // append new script element
                    JS.element(content);
                    break;
                case "styles-rules":    // add new style rule
                    CSS.rules(content);
                    break;
                case "styles-file":    // append new styles reference
                    CSS.reference(content, callback);
                    break;
                case "script-file":    // append new script reference
                    JS.reference(content, callback);
                    break;
                case "styles-files":    // append a group of new styles references
                    CSS.references(content, callback);
                    break;
                case "script-files":    // append a group of new script references
                    JS.references(content, callback);
                    break;
                default:
                    throw new Error("\"addResource\" requires an valid type assigned." + (typeof type === "string" ? " \"" + type + "\" is not supported" : ""));
            }
        };

    return exports;
} (document));