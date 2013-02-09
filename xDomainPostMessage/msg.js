var i = document.getElementsByTagName("iframe")[0],
    b = document.getElementsByTagName("button")[0];

window.addEventListener("message", function (event) {
    if (event.origin === "http://localhost:3" || event.origin === "http://127.0.0.1:1337") {
        if (event.data === "hello") {
            event.source.postMessage("hello back", event.origin);
        } else {
            alert(event.data);
        }
    }
}, false);

b.addEventListener("click", function (event) {
    // postMessage's second argument is the target URL
    i.contentWindow.postMessage("hello", i.src);
}, false);