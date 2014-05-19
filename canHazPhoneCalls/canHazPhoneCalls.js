var canHazPhoneCalls = (function __canHazPhoneCalls__ (window, navigator, document) {
    var exports = {};
    var ready = false;
    var _resources;
    var collection = {
        WEBRTC: false,
        FLASH: false,
        USER_MEDIA_MICROPHONE: false,
        FLASH_MICROPHONE: false,
    };
    var register = function (who, what, fn) {
        collection[who] = what;
        if (typeof fn === "function") {
            fn(who, what);
        }
    };
    var detect = {};
    detect.webRTC = function canHazPhoneCalls$_detect$webRTC (fn) {
        window.RTCPeerConnection = window.RTCPeerConnection ||
                window.webkitRTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.msRTCPeerConnection;
        register("WEBRTC",
                typeof window.RTCPeerConnection === "function",
                fn);
    };
    detect.userMedia_mic = function canHazPhoneCalls$_detect$userMedia_mic (fn) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register("USER_MEDIA_MICROPHONE",
                        false,
                        fn);
            }, (5 * 1000));
        navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

        if (typeof navigator.getUserMedia === "function") {
            navigator.getUserMedia({ audio: true },
                function (stream) {
                    // console.log("waiting for audio");
                    var audioContext = new window.webkitAudioContext(),
                        analyser = audioContext.createAnalyser(),
                        microphone = audioContext.createMediaStreamSource(stream),
                        javascriptNode = audioContext.createJavaScriptNode(2048, 1, 1);

                    analyser.smoothingTimeConstant = 0.3;
                    analyser.fftSize = 1024;
    
                    microphone.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);

                    javascriptNode.onaudioprocess = function () {
                        if (finished) {
                            return;
                        }
                        var array = new Uint8Array(analyser.frequencyBinCount),
                            len = array.length,
                            i = 0,
                            values = 0,
                            average;
                        analyser.getByteFrequencyData(array);

                        for (; i < len; i++) {
                            values += array[i];
                        }

                        average = values / len;
                        if (average > 0) {
                            finished = true;
                            register("USER_MEDIA_MICROPHONE",
                                    true,
                                    fn);
                            clearTimeout(timer);
                        }
                    }
                }, function () {
                    register("USER_MEDIA_MICROPHONE",
                            false,
                            fn);
                    clearTimeout(timer);
                });
        } else {
            register("USER_MEDIA_MICROPHONE",
                    false,
                    fn);
        }
    };
    detect.flash = function canHazPhoneCalls$_detect$flash (fn) {
        var type = "application/x-shockwave-flash",
            plugins = navigator.plugins,
            mimeTypes,
            flashObject,
            version;
        if (plugins &&
                plugins.length > 0) {
            mimeTypes = navigator.mimeTypes;
            if (mimeTypes &&
                    mimeTypes[type]) {
                try {
                    version = parseInt(mimeTypes["application/x-shockwave-flash"].enabledPlugin.description.replace(/[a-zA-Z]/g, ""), 10);
                    register("FLASH",
                            version > 10,
                            fn);
                } catch (err) {
                    // do nothing
                }
            }
        } else if (navigator.appVersion.indexOf("Mac") === -1 &&
                window.execScript) {
            try {
                flashObject = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                debugger;
                version = parseInt(flashObject.GetVariable("$version").replace(/[a-zA-Z]/g, ""), 10);
            } catch (err) {
                version = -1;
            }
            register("FLASH",
                    version !== -1,
                    fn);
        }
    };

    detect.flash_mic = function canHazPhoneCalls$_detect$flash_mic (fn) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register("FLASH_MICROPHONE",
                        false,
                        fn);
            }, (5 * 1000)),
            object,
            param,
            embed,
            name = "flash_mic_detect",
            src = _resources.FLASH_MICROPHONE_TEST,
            first = document.getElementById(name),
            createElementWithAttributes = function createElementWithAttributes (tag, attributes) {
                var element = document.createElement(tag);
                attributes.forEach(function (attribute) {
                    element.setAttribute(attribute.name, attribute.value);
                });
                return element;
            },
            createParam = function createParam (name, value) {
                return createElementWithAttributes("param", [
                    { name: "name", value: name },
                    { name: "value", value: value }
                ]);
            };

        if (first !== null && first.parentNode) {
            first.parentNode.removeChild(first);
        }

        object = createElementWithAttributes("object", [
            { name: "classid", value: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" },
            { name: "codebase", value: "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" },
            { name: "width", value: "1" },
            { name: "height", value: "1" },
            { name: "id", value: name }
        ]);

        object.appendChild(createParam("allowScriptAccess", "always"));
        object.appendChild(createParam("movie", src));
        object.appendChild(createParam("quality", "high"));
        object.appendChild(createParam("bgcolor", "#ffffff"));

        object.appendChild(createElementWithAttributes("embed", [
            { name: "src", value: src },
            { name: "quality", value: "high" },
            { name: "bgcolor", value: "#ffffff" },
            { name: "width", value: "1" },
            { name: "height", value: "1" },
            { name: "name", value: name },
            { name: "allowScriptAccess", value: "always" },
            { name: "type", value: "application/x-shockwave-flash" },
            { name: "pluginspage", value: "http://www.macromedia.com/go/getflashplayer" }
        ]));

        document.body.appendChild(object);
        
        window.flashLoaded = function () {
            var movie = navigator.appName.toLowerCase().indexOf("microsoft") !== -1 ?
                    window[name] :
                    document[name],
                mics = movie.micNames();
            register("FLASH_MICROPHONE",
                    mics.length > 0,
                    fn);
            clearTimeout(timer);
            delete window.flashLoaded;
        };

    };

    exports.enlist = function canHazPhoneCalls$enlist (resources) {
        _resources = resources;
        return exports;
    };
    exports.report = function canHazPhoneCalls$report (fn) {
        if (!_resources) {
            return;
        }
        detect.webRTC(fn);
        detect.userMedia_mic(fn);
        detect.flash(fn);
        detect.flash_mic(fn);
        return exports;
    };
    exports.check = function canHazPhoneCalls$check (report, pass, fail) {
        var responses = {
            WEBRTC: function (who, what) {
                if (!!what) {
                    report("Using WebRTC, Waiting for microphone access...");
                    detect.userMedia_mic(responses.USER_MEDIA_MICROPHONE);
                } else {
                    detect.flash(responses.FLASH);
                }
            },
            USER_MEDIA_MICROPHONE: function (who, what) {
                if (!!what) {
                    report("Microphone Detected");
                    pass();
                } else {
                    report("No Microphone Detected");
                    fail();
                }
            },
            FLASH: function (who, what) {
                if (!!what) {
                    report("Using Flash, Waiting for microphone access...");
                    detect.flash_mic(responses.FLASH_MICROPHONE);
                } else {
                    report("No Available Media");
                }
            },
            FLASH_MICROPHONE: function (who, what) {
                if (!!what) {
                    report("Flash Microphone Detected!");
                } else {
                    report("No Available Media");
                }
            }
        };
        report = typeof report === "function" ? report : function () {};
        pass = typeof pass === "function" ? pass : function () {};
        fail = typeof fail === "function" ? fail : function () {};
        detect.webRTC(responses.WEBRTC);
    };

    return exports;

}(window, navigator, document, undefined));