var eventManager = (function () {
    "use strict";
    var exports,    // API
        collection = [],    // representing: @String- "event name": @EventListener- related event listener object
    
        // constructor:
        // each EventListener has:
        //     a distinctive name,
        //     a collection of methods to run,
        //     a context object,
        //     a hasPlayed status
        EventListener = function (name) {
            this.name = name;
            this.context = null;
            this.hasPlayed = false;
            this.methods = [];
            return this;
        };

    // set the context for the event
    // method listeners will be called on with context object as "this"
    EventListener.prototype.setContext = function (obj) {
        if (typeof obj === "object") {
            this.context = obj;
        }
        return this;
    };

    // add a method to the listener
    // will be fired each time the event is emitted
    EventListener.prototype.listen = function (method) {
        if (this.methods.indexOf(method) === -1) {
            this.methods.push(method);
        }
        return this;
    };

    // remove a method to the listener
    EventListener.prototype.unlisten = function (method) {
        while (this.methods.indexOf(method) !== -1) {
            this.methods.splice(this.methods.indexOf(method), 1);
        }
        return this;
    };

    // will be fired if the event is marked as "hasPlayed"
    // will fire once when the event is emitted, then be removed from the event by unlisten
    EventListener.prototype.once = function (method) {
        if (this.hasPlayed === true) {
            method.call(this.context);
            return this;
        }
        var that = this,
            fn = function fn () {
                method.call(that.context);
                // setTimeout(function () {
                    that.unlisten(fn);
                // }, 0);
            };
        this.listen(fn);
        return this;
    };

    // emit the event, mark it's "hasPlayed" to true, and fire all listeners
    EventListener.prototype.emit = function () {
        var i = 0,
            len = this.methods.length;
        while (i < len) {
            if (typeof this.methods[i] === "function") {
                this.methods[i].call(this.context);
            }
            ++i;
        }
        this.hasPlayed = true;
        return this;
    };
    
    // emit the event if it wasn't emitted already
    EventListener.prototype.emitOnce = function () {
        if (!this.hasPlayed) {
            this.emit();
        }
        return this;
    };

    // mark it's "hasPlayed" attribute to false
    // this is cool for using .once() later on
    EventListener.prototype.unemit = function () {
        this.hasPlayed = false;
        return this;
    };

    // apply to multiple event names
    // -----------------------------
    var MultipleLisener = function MultipleLisener (names) {
        var namesArray = names.split(","),
            trigger = function () {
                var i = 0,
                    len = this.methods.length;
                while (i < len) {
                    this.methods[i].call(this.context);
                    ++i;
                }
                return this;
            },
            that = this;

        this.context = null;
        this.methods = [];
        this.names = names;

        namesArray.forEach(function (name, index, array) {
            var eventName = name.trim(),
                fn = function fn () {
                    while (array.indexOf(eventName) !== -1) {
                        array.splice(array.indexOf(eventName), 1);
                    }
                    if (array.length === 0) {
                        trigger.call(that);
                        that.unlisten(fn);
                    }
                };
            array[index] = eventName;    // affect the original array
            exports(eventName).listen(fn);
        });
        return this;
    };

    MultipleLisener.prototype.setContext = EventListener.prototype.setContext;
    MultipleLisener.prototype.once = MultipleLisener.prototype.listen = EventListener.prototype.listen;
    MultipleLisener.prototype.unlisten = EventListener.prototype.unlisten;
    MultipleLisener.prototype.emit = function (names) {
        this.names.split(",").forEach(function (item) {
            exports(item.trim()).emit();
        });
        return this;
    };
    MultipleLisener.prototype.unemit = function () {
        this.names.split(",").forEach(function (item) {
            exports(item.trim()).unemit();
        });
        return this;
    };

    exports = function eventManager (name) {

        // multiple event listener
        if (name.indexOf(",") !== -1) {
            return new MultipleLisener(name);
        }

        // create new event listener and add it to the collection
        if (!collection[name]) {
            collection[name] = new EventListener(name);
        }

        // return relevant event listener
        return collection[name];
    };
    return exports;
}());