/* props: http://www.openjs.com/scripts/events/keyboard_shortcuts/ (Version 2.01.B) */
var KeyboardShortcuts = {
    "all_shortcuts": {}, //All the shortcuts are stored in this array
    "add": function (shortcut_combination, callback, options) {
        shortcut_combination = shortcut_combination.toLowerCase();
        //Provide a set of default options
        var default_options = {
            type: "keydown",
            propagate: false,
            disable_in_input: false,
            target: document,
            keycode: false
        };
        if (!options) {
            options = default_options;
        } else {
            for (var defaults in default_options) {
                if (options[defaults] === undefined) {
                    options[defaults] = default_options[defaults];
                }
            }
        }
        var ele = options.target;
        if (typeof options.target === "string") {
            ele = document.querySelector(options.target);
        }
        //The function to be called at keypress
        var func = function (event) {
            event = event || window.event;
            var element,
                code,
                character,
                tagName,
                keys = shortcut_combination.split("+"),
                i = 0,
                loops = keys.length,
                key,
                //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                keyPressed = 0,
                //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                // may vary on non US-EN keyboards (2 in " in UK)
                shift_nums = {
                    //"`": "~", // moved to exeptions
                    "1": "!",
                    "2": "@",
                    "3": "#",
                    "4": "$",
                    "5": "%",
                    "6": "^",
                    "7": "&",
                    "8": "*",
                    "9": "(",
                    "0": ")",
                    "-": "_",
                    "=": "+",
                    ";": ":",
                    "'": "\"",
                    ",": "<",
                    ".": ">",
                    "/": "?",
                    "\\": "|"
                },
                //Special Keys - and their codes
                special_keys = {
                    "esc": 27, "escape": 27,
                    "tab": 9,
                    "spacebar": 32, "space_bar": 32, "space": 32,
                    "return": 13, "enter": 13,
                    "backspace": 8,
                    "scrolllock": 145, "scroll_lock": 145, "scroll": 145,
                    "capslock": 20, "caps_lock": 20, "caps": 20,
                    "numlock": 144, "num_lock": 144, "num": 144,
                    "pause": 19, "break": 19,
                    "insert": 45, "home": 36, "delete": 46, "end": 35,
                    "pageup": 33, "page_up": 33, "pu": 33,
                    "pagedown": 34, "page_down": 34, "pd": 34,
                    "left": 37, "up": 38, "right": 39, "down": 40,
                    "f1": 112, "f2": 113, "f3": 114, "f4": 115, "f5": 116, "f6": 117, "f7": 118, "f8": 119, "f9": 120, "f10": 121, "f11": 122, "f12": 123
                };
            if (options.disable_in_input === true) {
                //Don't enable shortcut keys in Input, Textarea fields
                element = event.target ? event.target : event.srcElement;
                element = element.nodeType === 3 ? element.parentNode : element;
                tagName = element.tagName.toUpperCase();
                if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || tagName === "OPTION") {
                    return;
                }
            }
            
            //Find Which key is pressed
            code = event.keyCode ? event.keyCode : event.which;
            character = String.fromCharCode(code).toLowerCase();
            switch (code) {
                case 188: //If the user presses , when the type is onkeydown
                    character = ",";
                    break;
                case 190: // If the user presses . when the type is onkeydown
                    character = ".";
                    break;
                case 192: // If the user presses ~ when the type is onkeydown
                    character = "~";
                    break;
                default:
                    break;
            }
            
            var modifiers = {
                shift: { wanted: false, pressed: false },
                ctrl: { wanted: false, pressed: false },
                alt: { wanted: false, pressed: false },
                meta: { wanted: false, pressed: false}	//Meta is Mac specific
            };

            if (event.ctrlKey) {
                modifiers.ctrl.pressed = true;
            }
            if (event.shiftKey) {
                modifiers.shift.pressed = true;
            }
            if (event.altKey) {
                modifiers.alt.pressed = true;
            }
            if (event.metaKey) {
                modifiers.meta.pressed = true;
            }

            for (; i < loops; i++) {
                key = keys[i];
                //Modifiers
                if (key === "ctrl" || key === "control") {
                    keyPressed++;
                    modifiers.ctrl.wanted = true;
                } else if (key === "shift") {
                    keyPressed++;
                    modifiers.shift.wanted = true;
                } else if (key === "alt") {
                    keyPressed++;
                    modifiers.alt.wanted = true;
                } else if (key === "meta") {
                    keyPressed++;
                    modifiers.meta.wanted = true;
                } else if (key.length > 1) { //If it is a special key
                    if (special_keys[key] === code) {
                        keyPressed++;
                    }
                } else if (options.keycode) {
                    if (options.keycode === code) {
                        keyPressed++;
                    }
                } else { //The special keys did not match
                    if (character === key) {
                        keyPressed++;
                    } else {
                        if (shift_nums[character] && event.shiftKey) { //Stupid Shift key bug created by using lowercase
                            character = shift_nums[character];
                            if (character === key) {
                                keyPressed++;
                            }
                        }
                    }
                }
            }

            if (keyPressed === keys.length &&
						modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
						modifiers.shift.pressed === modifiers.shift.wanted &&
						modifiers.alt.pressed === modifiers.alt.wanted &&
						modifiers.meta.pressed === modifiers.meta.wanted) {
                callback(event);
                if (!options.propagate) { //Stop the event
                    //event.cancelBubble is supported by IE - this will kill the bubbling process.
                    event.cancelBubble = true;
                    event.returnValue = false;
                    //event.stopPropagation works in Firefox.
                    if (event.stopPropagation) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    return false;
                }
            }
        };
        this.all_shortcuts[shortcut_combination] = {
            callback: func,
            target: ele,
            event: options.type
        };
        //Attach the function with the event
        if (ele.addEventListener) {
            ele.addEventListener(options.type, func, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + options.type, func);
        } else {
            ele["on" + options.type] = func;
        }
    },
    //Remove the shortcut - just specify the shortcut and I will remove the binding
    "remove": function (shortcut_combination) {
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this.all_shortcuts[shortcut_combination];
        delete (this.all_shortcuts[shortcut_combination]);
        if (!binding) {
            return;
        }
        var type = binding.event;
        var ele = binding.target;
        var callback = binding.callback;
        if (ele.detachEvent) {
            ele.detachEvent("on" + type, callback);
        } else if (ele.removeEventListener) {
            ele.removeEventListener(type, callback, false);
        } else {
            ele["on" + type] = false;
        }
    }
};
/* IMPLEMENT
KeyboardShortcuts.add("Ctrl+z",function() {
	alert("undo feature");
},{ "type": "keydown", "propagate": false, "disable_in_input": true, "target": document });
*/