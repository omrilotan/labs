var soundPlayer = (function () {
    "use strict";
    var collection = {},
        Sound,
        embed = null;
    Sound = function (name) {
        var source;

        this.name = name;
        this.audio = document.createElement("audio");
        this.empty = true;
    };

    Sound.prototype.src = function (url, type) {
        this.empty = false;
        var source = document.createElement("source");
        source.src = url;
        if (type) {
            source.type = type;
        }
        this.audio.appendChild(source);
        return this;
    };

    Sound.prototype.play = function () {
        if (!this.empty && this.isWorking()) {
            this.audio.play();
        } else {
            if (embed !== null && embed.parentNode) {
                embed.parentNode.removeChild(embed);
            }
            embed = document.createElement("embed");
            embed.hidden = "true";
            embed.autostart = "true";
            embed.src = this.name + ".mp3";
            document.body.appendChild(embed);
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