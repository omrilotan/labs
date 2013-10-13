(function (document, body) {
    var wrap = document.createElement("div");
    var div = document.createElement("div");
    var player = {
        element: null,
        size: 24
    };
    var unit = 12;

    var keyboard = function (collection) {
        var key;
        for (key in collection) {
            KeyboardShortcuts.add(key, collection[key]);
        }
    };


    var actions = {
        go: {
            up: function go$up () {
                if (parseInt(player.element.style.top, 10) > 0) {
                    player.element.style.top = (parseInt(player.element.style.top, 10) - unit) + "px";
                }
            },
            down: function go$down () {
                if (parseInt(player.element.style.top, 10) < (wrap.clientHeight - player.element.offsetHeight)) {
                    player.element.style.top = (parseInt(player.element.style.top, 10) + unit) + "px";
                }
            },
            left: function go$left () {
                if (parseInt(player.element.style.left, 10) < (wrap.clientWidth - player.element.offsetWidth)) {
                    player.element.style.left = (parseInt(player.element.style.left, 10) + unit) + "px";
                }
            },
            right: function go$right () {
                if (parseInt(player.element.style.left, 10) > 0) {
                    player.element.style.left = (parseInt(player.element.style.left, 10) - unit) + "px";
                }
            }
        }
    };

    keyboard({
        "h": actions.go.right,
        "j": actions.go.down,
        "k": actions.go.up,
        "l": actions.go.left
    });

    wrap.setAttribute("style", "width:240px; height:240px; background:#333; margin:auto; overflow: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0; border-radius:12px;");
    div.setAttribute("style", "width:100%; height:100%; position:relative;");
    player.element = document.createElement("div");
    player.element.className = "player animated";
    player.element.setAttribute("style", "width:" + player.size + "px; height:24px; background:#f00; position:absolute; top:0; left:0; border-radius:12px;");

    div.appendChild(player.element);
    wrap.appendChild(div);
    body.appendChild(wrap);
}(document, document.body));
