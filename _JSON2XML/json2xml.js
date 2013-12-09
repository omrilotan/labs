var JSON2XML = (function __JSON2XML__ () {
    "use strict";
    var wrap = function JSON2XML$_wrap (value, tag) {

            // <tag>value</tag> representation
            return "<" + tag + ">" +
                    value +
                    "</" +  tag + ">";
        },
        
        // Interface
        exports = function JSON2XML (value, tag) {
            var xml = [],
                key;
            if (typeof value === "object") {
                if (value instanceof Array) {
                    
                    // Push an array of XML style objects
                    value.forEach(function JSON2XML$arrayIterator (item) {
                        xml.push(exports(item));
                    });
                } else if (value instanceof Object) {

                    // Push a new XML sub-tree with a sub-root tag of the current key
                    for (key in value) {
                        if (value.hasOwnProperty(key)) {
                            xml.push(exports(value[key], key));
                        }
                    }
                }
            } else {
                xml.push(value);
            }
            return tag ?
                    
                    // Wrap with a root tag
                    wrap(xml.join(""), tag) :
                    
                    // Don't wrap with a root tag
                    xml.join("");
        };
    return exports;
})();