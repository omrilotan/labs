var bookmarks_json = [
    {
        "title": "Services",
        "id": 1,
        "children": [
            {
                "title": "Instapaper",
                "id": 2,
                "parent": 1,
                "uri": "http://www.instapaper.com/u"
            },
            {
                "index": 1,
                "title": "Github",
                "id": 3,
                "parent": 1,
                "uri": "https://github.com/watermelonbunny"
            }
        ]
    },
    {
        "title": "Magazines",
        "id": 4,
        "children": [
            {
                "title": "Ars Technica",
                "id": 5,
                "parent": 4,
                "uri": "http://arstechnica.com/"
            },
            {
                "index": 1,
                "title": ".net Magazine | The world's best-selling magazine for web designers and developers since 1994",
                "id": 6,
                "parent": 4,
                "uri": "http://netmagazine.com/"
            }
        ]
    },
    {
        "title": "Books",
        "id": 7,
        "children": [
            {
                "title" : "Physics Database",
                "id": 8,
                "parent" :7,
                "uri": "http://physicsdatabase.com/book-list-by-title/"
            }
        ]
    }
];
(function (window) {
    if (document.getElementById("bookmark-let-widget") !== null) {
        return;
    }
    var body = document.getElementsByTagName("body")[0],
        head = document.getElementsByTagName("head")[0],
        style = document.createElement("style"),
        widget = document.createElement("div"),
        x = document.createElement("div"),
        css = "",
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
    // reset
    css += ".bookmark-let-widget, .bookmark-let-widget * { text-align:left; font:normal 13px sans-serif; }";
    // box
    css += ".bookmark-let-widget { position: absolute; min-height:100px; max-width:400px; min-width:100px; left:5px; top:5px; background:white; border:1px solid #aa6600; box-shadow:2px 2px 5px #aa6600; }";
    css += ".bookmark-let-widget * { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }";
    // title
    css += ".bookmark-let-widget .title { padding:2px 5px; color:#aa6600; font-weight:bold; }";
    // link
    css += ".bookmark-let-widget a { display:block; padding:2px 5px; }";
    // close button
    css += ".bookmark-let-widget .close { display:block; float:right; background:#aa6600; color:white; font-weight:bold; padding:1px 7px; cursor:pointer; }";

    // Start style
    style.type = "text/css";
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    widget.className = "bookmark-let-widget";
    widget.id = "bookmark-let-widget";
    x.className = "close"; 
    x.innerHTML = "X";
    x.title = "close";
    x.onclick = function () {
        body.removeChild(widget)
    };
        
    widget.appendChild(x);

    for (i = 0, len = bookmarks_json.length; i < len; i++) {
        addListItem(bookmarks_json[i]);
    }
    
    for (i = 0, len = bookmarksList.length; i < len; i++) {
        widget.appendChild(bookmarksList[i]);
    }

    body.appendChild(widget);

}(window, undefined));