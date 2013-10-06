(function (window) {
    if (document.getElementById("bookmark-let-widget") !== null) {
        return;
    }
    var body = document.getElementsByTagName("body")[0],
        head = document.getElementsByTagName("head")[0],
        style = document.createElement("style"),
        widget = document.createElement("div"),
        x = document.createElement("div"),
        loading = document.createElement("div"),
        bookmarksList = [],
        i,
        len,
        addListItem = function (item) {
            var a,
                i,
                len;
            if (typeof item.uri === "string") {
                a = document.createElement("a");
                a.innerHTML = item.title;
                a.title = item.title;
                a.href = item.uri;
                bookmarksList.push(a);
            } else if (typeof item.children === "object") {
                a = document.createElement("div");
                a.innerHTML = item.title;
                a.title = item.title;
                a.className = "title";
                bookmarksList.push(a);
                for (i = 0, len = item.children.length; i < len; i++) {
                    addListItem(item.children[i]);
                }
            }
        };

    widget.className = "bookmark-let-widget";
    widget.id = "bookmark-let-widget";
    loading.innerHTML = "loading";
    x.className = "close";
    x.innerHTML = "X";
    x.title = "close";
    x.onclick = function () {
        body.removeChild(widget)
    };
        
    widget.appendChild(x);
    widget.appendChild(loading);

    setTimeout(function () {
        widget.removeChild(loading);
        
        addResource("script-file", "bookmarks.js", function () {
            for (i = 0, len = bookmarks.length; i < len; i++) {
                addListItem(bookmarks[i]);
            }
            
            for (i = 0, len = bookmarksList.length; i < len; i++) {
                widget.appendChild(bookmarksList[i]);
            }

        });
    }, 200);
    
    body.appendChild(widget);

}(window, undefined));