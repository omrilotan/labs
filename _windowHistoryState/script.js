var page = (function (window) {
    var collection = {},
        pop = function (event) {
            alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        };

    if (typeof window.addEventListener === "function" () {
        window.addEventListener("popstate", pop);
    } else if (typeof window.attachEvent === "function") {
        window.attachEvent("onpopstate", pop);
    } else {
        window.onpopstate = pop;
    }

    var Page = function (name) {
        this.name = name;
        this.data = null;
        return this;
    };
    
    // navigate to this page
    Page.prototype.go = function () {
        window.history.pushState(this.data, this.name, "#!/" + this.name);
        return this;
    };

    // getter / setter
    Page.prototype.data = function (data) {
        if (typeof data === "object") {
            this.data = data;
            return this;
        } else {
            return this.data;
        }
    };

    return function (name) {
        if (!collection[name]) {
            collection[name] = new Page(name);
        }
        return collection[name];
    };

}(window));