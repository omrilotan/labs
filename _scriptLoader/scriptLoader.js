var scriptLoader = function (scripts, callback) {
    scripts = typeof scripts === "string" ? [scripts] : scripts;

    var addScript = function addScript (uri, scriptCallback) {
            var script = document.createElement("script");
            script.async = true;
            script.src = uri;

            if (typeof scriptCallback === "function") {
                script.onload = script.onreadystatechange = function () {
                    if (!script.readyState || /complete|loaded/.test(script.readyState)) {
                        scriptCallback();
                        script.onload = script.onreadystatechange = null;
                    }
                };
            }
            document.body.appendChild(script);
        },
        loadRespectively = function loadRespectively (array) {
            var i = 0,
                len = array.length,
                loadNext = function loadNext (array, i, callback) {
                    i++;
                    if (i < array.length) {
                        addScript(array[i], function () {
                            loadNext(array, i, callback);
                        });
                    } else {
                        callback();
                    }
                };
            loadNext(array, -1, callback);
        };

    loadRespectively(scripts);
};