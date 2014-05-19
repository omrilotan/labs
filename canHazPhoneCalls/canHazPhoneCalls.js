var canHazPhoneCalls = (function __canHazPhoneCalls__ (window, navigator, document) {
    var constants = {
        messages: {
            0: "WEBRTC_WAITING_FOR_MICROPHONE",
            1: "DETECTING_MICROPHONE_INPUT",
            2: "ALLOW_MICROPHONE_ACCESS",
            3: "MICROPHONE_DETECTED",
            
            4: "FLASH_WAITING_FOR_MICROPHONE",
            5: "FLASH_MICROPHONE_DETECTED",
            
            6: "NO_AVAILABLE_MEDIA",
            7: "NO_MICROPHONE_DETECTED"
        },
        services: {
            0: "WEBRTC",
            1: "FLASH",
            2: "USER_MEDIA_MICROPHONE",
            3: "FLASH_MICROPHONE"
        }
    };
    var exports = {};
    var resources;
    var register = function (who, what, fn) {
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
        register(constants.services[0],
                typeof window.RTCPeerConnection === "function",
                fn);
    };
    detect.userMedia_mic = function canHazPhoneCalls$_detect$userMedia_mic (fn, report) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register(constants.services[2],
                        false,
                        fn);
                clearTimeout(timer);
            }, (40 * 1000)),
            allowTimer = setTimeout(function () {
                clearTimeout(allowTimer);
                report(constants.messages[2]);
            }, (5 * 1000)),
            start,
            end;
        
        navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

        window.AudioContext = window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.msAudioContext;

        if (typeof navigator.getUserMedia === "function") {
            start = (new Date()).getTime();
            navigator.getUserMedia({ audio: true },
                function (stream) {
                    clearTimeout(allowTimer);
                    try {
                        var audioContext = new window.AudioContext(),
                            analyser = audioContext.createAnalyser(),
                            microphone = audioContext.createMediaStreamSource(stream),
                            javascriptNode = audioContext.createJavaScriptNode(2048, 1, 1);
                    } catch (err) {
                        report(err.message);
                        return;
                    }

                    analyser.smoothingTimeConstant = 0.3;
                    analyser.fftSize = 1024;
    
                    microphone.connect(analyser);
                    analyser.connect(javascriptNode);
                    javascriptNode.connect(audioContext.destination);

                    report(constants.messages[1]);
                    javascriptNode.onaudioprocess = function () {
                        if (finished === true) {
                            return;
                        }
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            finished = true;
                            register(constants.services[2],
                                    false,
                                    fn);
                            clearTimeout(timer);
                        }, (5 * 1000));

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
                            register(constants.services[2],
                                    true,
                                    fn);
                            clearTimeout(allowTimer);
                            clearTimeout(timer);
                            end = (new Date()).getTime();
                            console.log((end - start) / 1000 + " Seconds");
                        }
                    }
                }, function () {
                    clearTimeout(allowTimer);
                    clearTimeout(timer);
                    if (finished === true) {
                        return;
                    }
                    register(constants.services[2],
                            false,
                            fn);
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
                    version = parseInt(mimeTypes[type].enabledPlugin.description.replace(/[a-zA-Z]/g, ""), 10);
                    register(constants.services[1],
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
                version = parseInt(flashObject.GetVariable("$version").replace(/[a-zA-Z]/g, ""), 10);
            } catch (err) {
                version = -1;
            }
            register(constants.services[1],
                    version !== -1,
                    fn);
        }
    };

    detect.flash_mic = function canHazPhoneCalls$_detect$flash_mic (fn) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register(constants.services[3],
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
            register(constants.services[3],
                    mics.length > 0,
                    fn);
            clearTimeout(timer);
            delete window.flashLoaded;
        };

    };

    exports.resources = function canHazPhoneCalls$resources (list) {
        resources = list;
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
                    report(constants.messages[0]);
                    detect.userMedia_mic(responses.USER_MEDIA_MICROPHONE, report);
                } else {
                    detect.flash(responses.FLASH);
                }
            },
            USER_MEDIA_MICROPHONE: function (who, what) {
                if (!!what) {
                    pass(constants.messages[3]);
                } else {
                    fail(constants.messages[7]);
                }
            },
            FLASH: function (who, what) {
                if (!!what) {
                    report(constants.messages[4]);
                    detect.flash_mic(responses.FLASH_MICROPHONE);
                } else {
                    fail(constants.messages[6]);
                }
            },
            FLASH_MICROPHONE: function (who, what) {
                if (!!what) {
                    pass(constants.messages[5]);
                } else {
                    fail(constants.messages[7]);
                }
            }
        };
        report = typeof report === "function" ? report : function empty () {};
        pass = typeof pass === "function" ? pass : function empty () {};
        fail = typeof fail === "function" ? fail : function empty () {};
        detect.webRTC(responses.WEBRTC);
    };

    return exports;

}(window, navigator, document, undefined));