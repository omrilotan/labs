var soundPlayer = (function () {
    "use strict";
    var collection = {},
        fallbackObject = null,
        addParam = function (name, value) {
            var param = document.createElement("param");
            param.name = name;
            param.value = value;
            return param;
        },
        Sound = function (name) {
            this.name = name;
            this.audio = document.createElement("audio");
            this.first = null;
        };
    Sound.prototype.src = function (url, type) {
        var source = document.createElement("source");
        if (this.first === null) {
            this.first = { url: url, type: type };
        }
        source.src = url;
        if (type) {
            source.type = type;
        }
        this.audio.appendChild(source);
        return this;
    };
    Sound.prototype.play = function () {
        var embed;
        if (this.first === null) {
            throw new Error("Sound Player Error: no file was supplied");
        }
        if (this.isWorking()) {
            this.audio.play();
        } else {
            if (fallbackObject !== null && fallbackObject.parentNode) {
                fallbackObject.parentNode.removeChild(fallbackObject);
            }
            fallbackObject = document.createElement("object")
            fallbackObject.appendChild(addParam("autostart", "true"));
            fallbackObject.appendChild(addParam("autoplay", "true"));
            fallbackObject.appendChild(addParam("controller", "false"));
            fallbackObject.appendChild(addParam("hidden", "true"));
            embed = document.createElement("embed");
            embed.hidden = "true";
            embed.autostart = "true";
            embed.autoplay = "true";
            embed.controller = "false";
            embed.src = this.first.url;
            embed.type = this.first.type;
            fallbackObject.appendChild(embed);
            document.body.appendChild(fallbackObject);
        }
        return this;
    };
    Sound.prototype.isWorking = function () {
        return typeof this.audio.paused === "boolean" &&
                typeof this.audio.ended === "boolean";
    };
    return function (name) {
        if (!collection[name]) {
            collection[name] = new Sound(name);
        }
        return collection[name];
    };
}());