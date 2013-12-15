// Polyfills
if (typeof Element.prototype.addEventListener !== "function") {
    // useCapture (3rd argument) is disregarded
        Element.prototype.addEventListener =
            Window.prototype.addEventListener =
            HTMLDocument.prototype.addEventListener =
            function (type, method) {
        if (typeof this.attachEvent === "function") {
            this.attachEvent("on" + type, method);
        } else {
            this["on" + type] = method;
        }
    };
}
if (typeof Element.prototype.removeEventListener !== "function") {
    // useCapture (3rd argument) is disregarded
    Element.prototype.removeEventListener =
            Window.prototype.removeEventListener =
            HTMLDocument.prototype.removeEventListener =
            function (type, method) {
        if (typeof this.detachEvent === "function") {
            this.detachEvent("on" + type, method);
        } else {
            this["on" + type] = null;
        }
    };
}

(function __inkling__ (document, untitled) {
    var ink = null,
        addRule = function (sheet, selector, rules) {
            if (typeof sheet.insertRule === "function") {
                sheet.insertRule(selector + "{" + rules + "}", 1);
            } else if (typeof sheet.addRule === "function") {
                sheet.addRule(selector, rules, 1);
            } else {
                sheet.appendChild(document.createTextNode(selector + "{" + rules + "}"));
            }
        };
    create = function inkling$_create () {
        ink = document.createElement("div");
        ink.className = "x-inkling";
        
        // Create styles
        var sheet,
            name,
            content = {
                ".x-inkling": "position:absolute; top:0; left:0; z-index:999; background:white ;" + 
                        "transition:all .3s ease-in .2s; -webkit-transition:all .3s ease-in .2s; " +
                        "padding:2px 5px; border-radius:5px; background:#454545; color:#fff; " +
                        "box-shadow:3px 3px 3px rgba(0, 0, 0, .3); " +
                        "font:normal 10px sans-serif; opacity:0;"
            };
        if (typeof document.styleSheets === "object" &&
                document.styleSheets.length > 0) {
            sheet = document.styleSheets[0];
        } else {
            sheet = document.createElement("style");
            document.head.appendChild(sheet);
        }
        for (name in content) {
            if (content.hasOwnProperty(name)) {
                addRule(sheet, name, content[name]);
            }
        }

        return ink;
    };
    locate = function (evt) {
        evt = evt || window.event;
        ink.style.top = (evt.pageY || evt.clientY + document.documentElement.scrollTop) - 25 + "px";
        ink.style.left = (evt.pageX || evt.clientX + document.documentElement.scrollLeft) + 15 + "px";
    };
    move = (function inkling$__move__ () {
        var timer = 0;
        return function inkling$_move (evt) {
            evt = evt || window.event;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function inking$_move$timer () {
                locate(evt);
            }, 50);
        };
    }());
    show = function inkling$_show (evt) {
        ink = ink || create();
        evt = evt || window.event;
        document.addEventListener("mousemove", move);
        if (!document.body.contains(ink)) {
            locate(evt);
        }
        document.body.appendChild(ink);
        ink.innerHTML = this.getAttribute("original-title") || "";
        setTimeout(function () {
            ink.style.opacity = 1;
        }, 0);
    };
    hide = function inkling$_hide () {
        document.removeEventListener("mousemove", move);
        if (document.contains(ink)) {
            document.body.removeChild(ink);
            ink.style.opacity = 0;
        }
    };
    detach = function inking$_detach (element) {
        element.removeEventListener("mouseover", show);
        element.removeEventListener("mouseout", hide);
    },
    attach = function inking$_attach (element, evt) {
        var text = element.title;
        element.setAttribute("original-title", element.title);
        element.removeAttribute("title");
        element.addEventListener("mouseover", show);
        element.addEventListener("mouseout", hide);
        show.call(element, evt);
    };

    document.addEventListener("mousemove", function inkling$mousemoveEvent (evt) {
        evt = evt || window.event;
        if (evt.target.title) {
            detach(evt.target);
            attach(evt.target, evt);
        }
    });
}(document));