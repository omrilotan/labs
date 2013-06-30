/*!
* translator
*/
var Translator = function (langFile, options) {
    "use strict";
    options = options || {};
    var that = this,
        ready = false,
        textAttribute = "data-text",
        customAttribute = "data-attr",
        trim = function (string) {
            return string.replace(/(^[\s]+|[\s]+$)/g, "");
        },
        missing = [],
        languageObject = {};

    (function () {
        if (typeof langFile === "object") {
            languageObject = langFile;
            ready = true;
            if (typeof options.onready === "function") {
                options.onready.call(languageObject);
            }
            return;    // undefined
        } else if (typeof langFile === "string") {
            var XHR = new XMLHttpRequest();
            XHR.open("GET", langFile, (typeof options.async === "boolean" ? options.async : false));
            XHR.setRequestHeader("Content-Type", "application/json");
            XHR.onload = function () {
                languageObject = JSON.parse(XHR.responseText);
                ready = true;
                if (typeof options.onready === "function") {
                    options.onready.call(languageObject);
                }
            };
            XHR.onerror = function () {
                throw new Error("translator.js error: error while loading language file");
            };
            XHR.send();
        } else {
            if (options.throwErrors === true) {
                throw new Error("translator.js error: expecting a language object or file URL");
            }
        }
    })();
    
    that.isKey = function (string) {
        if (!ready) {
            throw new Error("translator.js error: translator not ready");
        }
        // check the translation key format (has 3 * _)
        var isKey = -1;
        isKey = string.indexOf("_", isKey);
        if (isKey !== -1) {
            isKey = string.indexOf("_", isKey + 1);
        }
        if (isKey !== -1) {
            isKey = string.indexOf("_", isKey + 1);
        }
        return isKey !== -1;
    };
    that.text = function (key) {
        if (!ready) {
            throw new Error("translator.js error: translator not ready");
        }
        var returnValue = "";
        key = trim(key);
        if (typeof key !== "string") {
            throw new TypeError("translation key must be a string");
        }
        if (typeof languageObject[key] === "string") {
            returnValue = languageObject[key];
        } else {
            var arr = key.split("_");
            returnValue = "$" + arr[arr.length - 1] + "$";
            missing.push(key);
        }
        try {
            returnValue = trim(returnValue);
        } catch (e) {
            returnValue = returnValue.replace(/(^[\s]+|[\s]+$)/g, "");
        }
        return returnValue;
    };
    that.missing = function () {
        if (!ready) {
            throw new Error("translator.js error: translator not ready");
        }
        return missing;
    };
    that.element = function (element) {
        if (!ready) {
            throw new Error("translator.js error: translator not ready");
        }
        var elementTextAttribute = element.getAttribute(textAttribute),
            elementCustomAttribute = element.getAttribute(customAttribute),
            value,
            valueArr,
            i,
            loops;
        if (elementTextAttribute !== null) {
            value = document.createTextNode(that.text(elementTextAttribute));
            if (element.childNodes.length > 0) {
                element.insertBefore(value, element.childNodes[0]);
            } else {
                element.appendChild(value);
            }
            element.removeAttribute(textAttribute);
        }
        if (elementCustomAttribute !== null) {
            value = elementCustomAttribute.split(',');
            for (i = 0, loops = value.length; i < loops; i++) {
                valueArr = value[i].split('=');
                if (valueArr.length >= 2 &&
                        typeof valueArr[0] === "string" &&
                        typeof valueArr[1] === "string") {
                    element.setAttribute(trim(valueArr[0]), that.text(valueArr[1]));
                }
            }
            element.removeAttribute(customAttribute);
        }
        return element;
    };
    that.tree = function (parent) {
        if (!ready) {
            throw new Error("translator.js error: translator not ready");
        }
        parent = parent || document;
        var elements,
            len;
        if (typeof parent.querySelectorAll === "function") {
            elements = parent.querySelectorAll("*[" + textAttribute + "], *[" + customAttribute + "]");
        } else {
            elements = parent.getElementsByTagName("*");    // all successors
        }
        len = elements.length;
        while (len--) {
            that.element(elements[len]);
        }
        return parent;
    };
    return that;
};
/*
 * myApp.Translate = new Translator('/Culture/en-gb.js');
 */