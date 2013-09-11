/*
// Usage
//
// addResource("styles-text", @String css);
// addResource("script-text", @String script);
// addResource("styles-file", @String URL, @Function callback);
// addResource("script-file", @String URL, @function callback);
// addResource("styles-files", @String URL, @Function callback);
// addResource("script-files", @String URL, @function callback);
// addResource("styles-rules", @Object styles);
//
// Styles rules object example: {
//     ".myDiv": "color:blue; border:1px solid green;"
// }
*/

var addResource = (function (document) {
    "use strict";
    var head,
        collection = [],
        setArrtibute,
        forkSetArrtibute = function (element) {
            if (typeof element.setAttribute === "function") {
                return function (element, name, value) {
                    element.setAttribute(name, value);
                };
            } else {
                return function (element, name, value) {
                    element[name] = value;
                };
            }
        },
        setAttributes = function (element, attributes) {
            var name;
            setArrtibute = typeof setArrtibute === "function" ? setArrtibute : forkSetArrtibute(element);
            for (name in attributes) {
                if (attributes.hasOwnProperty(name)) {
                    setArrtibute(element, name, attributes[name]);
                }
            }
            return element;
        },
        addRule = function (sheet, selector, rules) {
            if (typeof sheet.insertRule === "function") {
                sheet.insertRule(selector + "{" + rules + "}", 1);
            } else if (typeof sheet.addRule === "function") {
                sheet.addRule(selector, rules, 1);
            } else {
                sheet.appendChild(document.createTextNode(selector + "{" + rules + "}"));
            }
        },
        CSS = {
            create: function (url) {
                var element = document.createElement("style"),
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
            element: function (content) {
                var element = CSS.create();
                if (typeof content === "string") {
                    if (typeof element.styleSheet === "object") {
                        element.styleSheet.cssText = content;
                    } else {
                        element.appendChild(document.createTextNode(content));
                    }
                }
                head.appendChild(element);
            },
            rules: function (content) {
                var sheet,
                    name;
                if (typeof document.styleSheets === "object" &&
                        document.styleSheets.length > 0) {
                    sheet = document.styleSheets[0];
                } else {
                    sheet = CSS.create();
                    head.appendChild(sheet);
                }
                for (name in content) {
                    if (content.hasOwnProperty(name)) {
                        addRule(sheet, name, content[name]);
                    }
                }
            },
            reference: function (content, callback) {
                if (collection.indexOf(content) === -1) {
                    var element = CSS.create(content);
                    element.onload = callback;
                    head.appendChild(element);
                    collection.push(content);
                }
            },
            references: function (head, array, callback) {
                var loaded = 0;
                array.forEach(function (item) {
                    CSS.reference(item, function () {
                        loaded++;
                        if (loaded === array.length) {
                            callback();
                        }
                    });
                });
            }
        },
        JS = {
            create: function (url) {
                var element = document.createElement("script"),
                    attributes = {
                        "type": "text/javascript"
                    };
                if (typeof url === "string") {
                    attributes["src"] = url;
                }
                setAttributes(element, attributes);
                return element;
            },
            element: function (content) {
                var element = JS.create();
                try {
                    element.appendChild(document.createTextNode(content));
                } catch (e) {
                    element.text = content;
                }
                head.appendChild(element);
            },
            reference: function (content, callback) {
                if (collection.indexOf(content) === -1) {
                    var element = JS.create(content);
                    element.onload = callback;
                    head.appendChild(element);
                    collection.push(content);
                }
            },
            references: function (head, array, callback) {
                var loaded = 0;
                array.forEach(function (item) {
                    JS.reference(item, function () {
                        loaded++;
                        if (loaded === array.length) {
                            callback();
                        }
                    });
                });
            }
        };

    return function (type, content, callback) {
        head = head || document.getElementsByTagName("head")[0];
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
                CSS.references(head, content, callback);
                break;
            case "script-files":    // append a group of new script references
                JS.references(head, content, callback);
                break;
            default:
                throw new Error("\"addResource\" requires an valid type assigned." + (typeof type === "string" ? " \"" + type + "\" is not supported" : ""));
        }

    };
} (document));