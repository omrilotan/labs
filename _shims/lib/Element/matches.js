Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector || function (query) {
            var collection = document.querySelectorAll(query);
            return [].indexOf.call(collection, this);
        };