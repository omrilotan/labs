window.CHAT = window.CHAT || {};

CHAT.stencil = (function (window, document, undefined) {
    var stencil = new Stencil("templates/templates.html", {
        async: true,
        onready: function () {
            window.initDOM(); // alert someone!
        }
    });
    // sys-listener
    stencil.extend("sys-listener", function (node, value, dataitem) {
        // break up listener to event and function
        if (typeof value === "string" || listenerString.indexOf("=") !== -1 || typeof dataitem === "object") {
            var listenerArray = value.split("="),
                func = stencil.helpers.getValue(node, listenerArray[1], dataitem);
            if (typeof func === "function") {
                CHAT.helpers.addListener(node, listenerArray[0], function (event) {
                    func.call(null, event, dataitem);
                });
            }
        }
        return node;
    });

    // sys-handle
    stencil.extend("sys-handle", function (node, value, dataitem) {
        // break up listener to event and function
        var func = stencil.helpers.getValue(node, value, dataitem);
        func.call(node);
        return node;
    });

    // sys-foreach
    stencil.extend("sys-foreach", function (node, value, dataitem) {
        var fragment = document.createDocumentFragment(),
            array = stencil.helpers.getValue(node, value.trim(), dataitem),
            i = 0,
            len = array.length,
            parent = node.parentNode;

        // very important to remove this attribute before it'll try to loop through itself
        node.removeAttribute("sys-foreach");
        for (; i < len; i++) {
            // array[i]._index = i + 1 + '';
            fragment.appendChild(namespace.proccess(node, array[i]));
        }
        // finally
        parent.replaceChild(fragment, node);
        return parent;
    });

    return stencil;
}(window, document));