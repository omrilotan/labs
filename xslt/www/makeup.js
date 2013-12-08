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
                        callback(XHR.responseXML);    // responseText
                    };
                    XHR.send();
                };
            }
        }()),

        // Constructor
        Makeup = function Makeup (xml, xsl, callback) {
            if (typeof request !== "function") {
                return;
            }
            this.waitingOn = 2;    // waiting on two files
            this.callback = callback;
            var that = this;
            request(xml, function Makeup$request (response) {
                that.xml = response;
                if (--that.waitingOn === 0) {
                    that.fuse();
                }
            });
            request(xsl, function Makeup$request (response) {
                that.xsl = response;
                if (--that.waitingOn === 0) {
                    that.fuse();
                }
            });
        };
    Makeup.prototype.fuse = function Makeup$fuse () {
        var fragment = document.createDocumentFragment();
        if (document.implementation && document.implementation.createDocument) {
            processor = new XSLTProcessor();
            processor.importStylesheet(this.xsl);
            resultDocument = processor.transformToFragment(this.xml, document);
            fragment = resultDocument;    // DOM Element
        } else {
            fragment.innerHTML = this.xml.transformNode(this.xsl);
        }
        this.callback(fragment);
    };
    return function makeup (xml, xsl, callback) {
        new Makeup(xml, xsl, callback);
    };
}());