var JSON2XML = (function __JSON2XML__ () {
    "use strict";
    var wrap = function JSON2XML$_wrap (tag, value) {
        return "<" + tag + ">" +
                value +
                "</" +  tag + ">";
    };

    // Interface
    var exports = function JSON2XML (obj, rootTag) {
        var xml = [],
            key,
            nKey,
            value;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                if (value instanceof Array &&
                        typeof value === "object") {

                    // Push an array of XML style objects
                    for (nKey in value) {

                        // Recursion
                        xml.push(exports(value[nKey]));
                    }
                } else if (value instanceof Object &&
                        typeof value === "object") {

                    // Push a new XML sub-tree with a sub-root tag of the current key
                    xml.push(wrap(key, exports(value)));
                } else {

                    // Simple <tag>value</tag> representation
                    xml.push(wrap(key, value));
                }
            }
        }
        return rootTag ?
                
                // Wrap with a root tag
                wrap(rootTag, xml.join("")) :

                // Don't wrap with a root tag
                xml.join("");
    };
    return exports;
})();