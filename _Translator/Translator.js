/*!
* translator
*/
var Translator = function (langFile, options) {
    options = options || {};
    var that = this,
        textAttribute = options.text || 'data-text',
        customAttribute = options.attr || 'data-attr',
        trim = function (string) {
            return string.replace(/(^[\s]+|[\s]+$)/g, '');
        },
        missing = [],
        languageObject = (function () {
            if (typeof langFile === 'object') {
                return langFile;
            } else if (typeof langFile === 'string') {
                var XHR = new XMLHttpRequest(),
                    lang = {};
                XHR.open('GET', langFile, false); // sync load (wait for load event)
                XHR.setRequestHeader('Content-Type', 'application/json');
                XHR.onload = function () {
                    lang = JSON.parse(XHR.responseText);
                };
                XHR.onerror = function () {
                    lang = JSON.parse(XHR.responseText);
                };
                XHR.send();
                return lang;
            } else {
                if (options.throwErrors === true) {
                    throw new Error('translator.js error: expecting a language object or file URL');
                }
                return {};
            }
        })();
    
    that.isKey = function (string) {
        // check the translation key format (has 3 * _)
        var isKey = -1;
        isKey = string.indexOf('_', isKey);
        if (isKey !== -1) {
            isKey = string.indexOf('_', isKey + 1);
        }
        if (isKey !== -1) {
            isKey = string.indexOf('_', isKey + 1);
        }
        return isKey !== -1;
    };
    that.text = function (key) {
        var returnValue = '';
        key = trim(key);
        if (typeof key !== 'string') {
            throw new TypeError('translation key must be a string');
        }
        if (typeof languageObject[key] === 'string') {
            returnValue = languageObject[key];
        } else {
            var arr = key.split('_');
            returnValue = '$' + arr[arr.length - 1] + '$';
            missing.push(key);
        }
        try {
            returnValue = trim(returnValue);
        } catch (e) {
            returnValue = returnValue.replace(/(^[\s]+|[\s]+$)/g, '');
        }
        return returnValue;
    };
    that.missing = function () {
        return missing;
    };
    that.element = function (element) {
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
                if (valueArr.length >= 2 && typeof valueArr[0] === 'string' && typeof valueArr[1] === 'string') {
                    element.setAttribute(trim(valueArr[0]), that.text(valueArr[1]));
                }
            }
            element.removeAttribute(customAttribute);
        }
        return element;
    };
    that.tree = function (parent) {
        parent = parent || document;
        var elements = parent.querySelectorAll('*[' + textAttribute + '], *[' + customAttribute + ']'),
            i = elements.length;
        while (i--) {
            that.element(elements[i]);
        }
        return parent;
    };
    return that;
};
/*
 * myApp.Translate = new Translator('/Culture/en-gb.js');
 */