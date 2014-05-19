var canHazPhoneCalls = (function __canHazPhoneCalls__ (window, navigator, document) {
    var constants = {
            msg: {
                0: "WEBRTC_WAITING_FOR_MICROPHONE",
                1: "DETECTING_MICROPHONE_INPUT",
                2: "ALLOW_MICROPHONE_ACCESS",
                3: "MICROPHONE_DETECTED",
                
                4: "FLASH_WAITING_FOR_MICROPHONE",
                5: "FLASH_MICROPHONE_DETECTED",
                
                6: "NO_AVAILABLE_MEDIA",
                7: "NO_MICROPHONE_DETECTED"
            },
            svc: {
                0: "WEBRTC",
                1: "FLASH",
                2: "USER_MEDIA_MICROPHONE",
                3: "FLASH_MICROPHONE"
            }
        },

        // Interface
        exports = {},

        // Detection methods
        detect = {},

        // flash file tests microphone presence
        FLASH_MIC_TEST_SWIFF,
        // FLASH_MIC_TEST_SWIFF = "data:application/x-shockwave-flash;base64,Q1dTCnUIAAB4nKVVXXPaRhTdRcCCANv4A9tJ01KcTl8KWmE7GMamdcE0zBTjMX7oS6espZVRo6+RhIGn5md1pg/5C/Slf6e9QhDjOMk4qQZmd++ec+7V0dXKQak/EfrrNdrBqJndQQj9sRGNIXTsqlrtstnKj03D8mqwOikMfN+pSdJoNCqN9ku2eyPJ1WpVomWpXC4CouhNLJ+Ni5a3V6jnZwpN7imu7vi6beWDNbu2h/5JoTCXHZvOW1nLKzHVvuYlxTalMXMkuUSlQAdAtYbLmW+7V7Zt1E8DVL5lMG+Qv3BtjXseyDMj3+gdHkvvopf4vAn/epnKcpFWinT/qlyu7e/XysGyRukSN0SG1A73mcp8dp98cEXl2j7Qqsvke9g53VZ1bfIo8h0yfyy9497j/FSVt3Y6Q9eYPSNVkbjBTW75HlgqzyxVlZpmuybz68xxDF1hgaA0LnoDW3k1Yre8qAX2Hkt3wM8tCe6s0/n4QzZNaYH2/EuufRztXU0cLl1yzx66Cgf43rxJOh2oxdVvudpybXNWi8Ncjwf4k8KCEIBnWWq65fnMUni7WQd2SdfVWqtSacly5YBWyvTFkSwfHTVeNA/OqjI9qzQPD6rH0gPqQk21lWFg8lxN/QS1JepCzXb1Gx16uvn5qu+RyM8a7b5Pd949THV6WG7RJv2xLH8o1QPqQq390NzHqrWXzQ1D3f9jxwcl3tvS0vzgq+dRI4L+RW+2UnAoYtRTuMXzMkJvNteFIADXGioFwzcoemvrauzUddkkfj40r7lLTF35DV6idIfp1pVuckO3eGb2VkHZnmOwSbJj3+q8YejO5hxcWwZn4WUczU65Hvd93brxEgA7Zyb34kOPd3RFgHUqlDS5qjMRYq7tDGyLxzUXgHI63PUmns/NRI8rQ1f3J5nF5IJZ3BA77cZl9+Jl9/wsHaRcZItZQarMDffvZFdCPT72uQteZs/mk7YFo8YUnmKq2mCGcc2UV2FpP9tM5WpUgeAKbLaCunozv+Pd69+54s9r5LfBCbV6FgxNMIj5yoC7mWboVQjNzvIwxYfmDSO5e/sNG74/YJ0b7zlwf1zM4VwsR3aSuZXtWC6b28l9hb4gOEKwQHCUROJESBAsEpwiOE1whsRWSXyNkHVCNgjeJHiL4BzB2ySxS/ATgoH7jOAvSTJPhK+JUCDCHhGek6AHZg0RgQEL6P6Fo7FEFMVicYwwwSiSwEhIIiSiFEZR2I7jaBQjAsykKEzpTxCKYDGVntJ+up/RVrqrGGIRDDECMVFbe4mQEBFCiPh3K4tfi/8AJCoAhEJs/TtxqsW7GxGYpaYaCWfpqZaA2bQvtrJokITI0+5mIB0LeGtTOm2jX7eeo6mW6m5FIB6HnMlvp5Sjfo72t2l/h/Z3af8J7T+l/Rj8fkHPwmsQBfj3G7tzG+bdXFruZvQDbPwH0DZtfg==",

        register = function (who, what, fn) {
            if (typeof fn === "function") {
                fn(who, what);
            }
        };
    detect.webRTC = function canHazPhoneCalls$_detect$webRTC (fn) {
        window.RTCPeerConnection = window.RTCPeerConnection ||
                window.webkitRTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.msRTCPeerConnection;

        register(constants.svc[0],    // WEBRTC_WAITING_FOR_MICROPHONE
                typeof window.RTCPeerConnection === "function",
                fn);
    };
    detect.userMedia_mic = function canHazPhoneCalls$_detect$userMedia_mic (fn, report) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register(constants.svc[2],
                        false,
                        fn);
                clearTimeout(timer);
            }, (40 * 1000)),
            allowTimer = setTimeout(function () {
                clearTimeout(allowTimer);
                report(constants.msg[2]);
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

                    report(constants.msg[1]);
                    javascriptNode.onaudioprocess = function () {
                        if (finished === true) {
                            return;
                        }
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            finished = true;
                            register(constants.svc[2],
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
                            register(constants.svc[2],
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
                    register(constants.svc[2],
                            false,
                            fn);
                });
        } else {
            register(constants.svc[2],
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
                    register(constants.svc[1],
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
            register(constants.svc[1],
                    version !== -1,
                    fn);
        }
    };

    detect.flash_mic = function canHazPhoneCalls$_detect$flash_mic (fn) {
        var finished = false,
            timer = setTimeout(function () {
                finished = true;
                register(constants.svc[3],
                        false,
                        fn);
            }, (5 * 1000)),
            object,
            param,
            embed,
            name = "flash_mic_detect",
            src = FLASH_MIC_TEST_SWIFF,
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
            register(constants.svc[3],
                    mics.length > 0,
                    fn);
            clearTimeout(timer);
            delete window.flashLoaded;
        };

    };

    exports = function canHazPhoneCalls (options) {
        options = options || {};
        if (typeof options.FLASH_MIC_TEST_SWIFF === "string") {
            FLASH_MIC_TEST_SWIFF = options.FLASH_MIC_TEST_SWIFF;
        }
    };

    exports.check = function canHazPhoneCalls$check (report, pass, fail) {
        var responses = {};

        // WEBRTC
        responses[constants.svc[0]] = function (who, what) {
            if (!!what) {
                report(constants.msg[0]);
                detect.userMedia_mic(responses[constants.svc[2]], report);
            } else {
                detect.flash(responses.FLASH);
            }
        };

        // USER_MEDIA_MICROPHONE
        responses[constants.svc[2]] = function (who, what) {
            if (!!what) {
                pass(constants.msg[3]);
            } else {
                fail(constants.msg[7]);
            }
        };

        // FLASH
        responses[constants.svc[1]] = function (who, what) {
            if (!!what) {
                report(constants.msg[4]);
                detect.flash_mic(responses[constants.svc[3]]);
            } else {
                fail(constants.msg[6]);
            }
        };

        // FLASH_MICROPHONE
        responses[constants.svc[3]] = function (who, what) {
            if (!!what && typeof FLASH_MIC_TEST_SWIFF === "string") {
                pass(constants.msg[5]);
            } else {
                fail(constants.msg[7]);
            }
        };
        report = typeof report === "function" ? report : function empty () {};
        pass = typeof pass === "function" ? pass : function empty () {};
        fail = typeof fail === "function" ? fail : function empty () {};
        detect.webRTC(responses.WEBRTC);
    };

    return exports;

}(window, navigator, document, undefined));