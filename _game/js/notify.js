var notify = (function (window, document, undefined) {
    var style = document.createElement("style"),
        styles = [
            "\n.x-notify-notification {",
            "\tposition:absolute;",
            "\tbottom:10px;",
            "\tleft:50%;",
            "\tmargin-left:-105px;",
            "\twidth:200px;",
            "\tfont:normal .85em sans-serif;",
            "\tmin-height:1em;",
            "\ttext-align:center;",
            "\twhite-space:pre-line;",
            "\tbackground:#333;",
            "\tcolor:#eee;",
            "\tborder:solid 1px #999;",
            "\tborder-radius:.5em;",
            "\tpadding:.25em 5px;",
            "\tbox-shadow:2px 2px 4px rgba(0, 0, 0, .5);",
            "}\n"
        ].join("\n"),
        stylesNode = document.createTextNode(styles),
        notification = null,
        timer,
        br,
        remove = function () {
            if (notification !== null) {
                document.body.removeChild(notification);
                notification = null;
            }
            clearTimeout(timer);
            timer = 0;
        },
        exports = function notify (message) {
            if (notification === null) {
                notification = document.createElement("div"),
                notification.className = "x-notify-notification";
                notification.onclick = remove;
                document.body.appendChild(notification);
            }
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(remove, 2000);

            var node = document.createTextNode(message);
            notification.appendChild(node);
            br = document.createElement("br");
            notification.appendChild(br);
        };
        
    // append styles to the document
        try {
            style.appendChild(stylesNode);
        } catch (e) {
            style.innerText = styles;
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(style);

    // export
    return exports;
}(window, document));