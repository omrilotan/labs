if (typeof String.prototype.format !== "function") {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
        });
    };
}

var combine = function () {
    var key,
        subject,
        combined = {};
    while (arguments.length) {
        subject = [].pop.call(arguments);
        for (key in subject) {
            if (subject.hasOwnProperty(key)) {
                combined[key] = subject[key];
            }
        }
    }
    return combined;
};

var xhrCall = function (url, callback, options) {
    var XHR = new XMLHttpRequest(),
        defaults = {
            async: true,
            method: "GET",
            type: "text/html"
        },
        vars = combine(defaults, options);

    // false 'async' (default) waits here for the load event
    XHR.open(vars.method, url, vars.async);
    XHR.setRequestHeader("Content-Type", vars.type);
    if (typeof callback === "function") {
        XHR.onreadystatechange = function  () {
            if (XHR.readyState === 4 &&

                    // 200: ready, 0: localhost
                    (XHR.status === 200 || XHR.status === 0)) {
                callback(XHR.responseText);
            }
        };
    }
    XHR.send();
};


xhrCall("js/bookmarks.json", function (response) {
    var bookmarks = JSON.parse(response),
        string = "";
    bookmarks.forEach(function (bookmark) {
        string += '<a href="{1}" target="_blank" title="{0}"><span>{0}</span><img src="data:image/png;base64,{2}" /></a>'.format(bookmark.name, bookmark.url, bookmark.image);
    });
    document.getElementsByTagName("div")[0].innerHTML = string;
}, {
    type: "application/json"
});