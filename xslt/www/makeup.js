var makeup = (function __makeup__ () {
    var request = (function makeup$__request__ () {
            var newXHR;
            if ("XMLHttpRequest" in window) {
                newXHR = function newXHR () {
                    return new XMLHttpRequest();
                };
            } else if ("ActiveXObject" in window) {
                newXHR = function newXHR () {
                    new ActiveXObject("Msxml2.XMLHTTP.3.0");
                };
            }
            if (newXHR) {
                return function makeup$request (url, callback) {
                    var XHR = newXHR();
                    XHR.open("GET", url, true);
                    XHR.onload = function makeup$request$onloadCallback () {
                        callback(XHR.responseXML);    // not responseText
                    };
                    XHR.send();
                };
            }
        }()),

        processor = new XSLTProcessor(),
        stylessheet = null,
        ready = false,
        listeners = [],

        // Constructor
        Makeup = function Makeup (xml, callback) {
            if (typeof request !== "function") {
                return;
            }
            var that = this;
            request(xml, function Makeup$request (responseXML) {
                if (ready) {
                    that.fuse(responseXML, callback);
                } else {
                    listeners.push(function () {
                        that.fuse(responseXML, callback);
                    });
                }
            });
        };
    Makeup.prototype.fuse = function Makeup$fuse (XMLData, callback) {
        var fragment = document.createDocumentFragment();
        if (document.implementation && document.implementation.createDocument) {
            resultDocument = processor.transformToFragment(XMLData, document);
            fragment = resultDocument;    // DOM Element
        } else {
            fragment.innerHTML = XMLData.transformNode(this.xsl);
        }
        if (typeof callback === "function") {
            callback(fragment);
        }
    };
    return {
        load: function makeup$load (xsl, callback) {
            var that = this;
            request(xsl, function Makeup$loadCallback (responseXML) {
                ready = true;
                listeners.forEach(function (item) {
                    item();
                });
                stylessheet = responseXML;
                processor.importStylesheet(responseXML);
                if (typeof callback === "function") {
                    callback.call(that);
                }
            });
        },
        fuse: function makeup$fuse (xml, callback) {
            new Makeup(xml, callback);
        }
    };
}());