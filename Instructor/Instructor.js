/******************************************************************************
Instructor is a replacement tooltip, you can fill it up with HTML escape strings
- simple show() method:
Instructor.show( 'this is the tooltip message' );
- complex show() method with params:
var params = {
    offsetTop: 10,
    offsetLeft: 10,
    endAlpha: 85,
    boundingElement: document.getElementById('wrapper')
};
var html = '<div class=\'myClass\'>this is the <span style=\'font-style:italic;\'>inner</span> html</div>';
Instructor.show( html, params );
- call on hide() method:
Instructor.hide();
- the hide() method can carry a function to be executed on finish
Instructor.hide(function(){ alert('done') });
...and so on...
******************************************************************************/
Instructor = {
    // *** standalone function *** // no use of libraries
    mouseInstructor: {},
    msie: navigator.appVersion.indexOf("MSIE") !== -1,
    I: {                        // default values
        offsetTop: 5,   // distance from the cursor
        offsetLeft: 5,     // distance from the cursor
        boundries: 10,     // how far to get from the end of the screen
        maxWidth: 300,     // maximum width
        width: null,     // default width
        showSpeed: 10,     // how many percents to jump during opacity tween
        timer: 20,         // opacity tween interval
        endAlpha: 100,     // opacity for fully displayed state
        currentAlpha: 0, // store the current opacity level
        boundingElement: null, // can define an element not to get out of
        followMouse: true, // does the Instructor follows the mouse
        tween: false,   // animated movement after the nouse
        autoHide: true,
        extraStyles: null
    },
    setDefaults: function (object) {
        // set new values to the defaults ! permanent per page
        if (object && typeof object === 'object') {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    Instructor.I[key] = object[key];
                }
            }
        }
    },
    show: function (_message, params) {
        if (!_message || typeof _message !== 'string') { // _message is a mandatory string
            return;
        }
        // set params as defaults
        Instructor.setDefaults(params);
        // create the Instructor div * only first time per page
        if (Instructor.Wrap === undefined) {
            Instructor.Wrap = document.createElement('span');
            Instructor.Wrap.setAttribute('id', 'mouseInstructor');
            Instructor.Content = document.createElement('div');
            Instructor.Wrap.appendChild(Instructor.Content);
            document.body.appendChild(Instructor.Wrap);
            Instructor.Wrap.style.position = 'fixed';
            Instructor.Wrap.style.display = 'inline-block';
            Instructor.Wrap.style.padding = '0 5px';
            Instructor.Wrap.style.opacity = 0;
            Instructor.Wrap.style.filter = 'alpha(opacity=0)';
            if (Instructor.I.followMouse) {
                document.onmousemove = this.pos;
            }
        }
        if (Instructor.I.extraStyles) {
            for (var key in Instructor.I.extraStyles) {
                if (Instructor.I.extraStyles.hasOwnProperty(key)) {
                    Instructor.Wrap.style[key] = Instructor.I.extraStyles[key];
                }
            }
        }
        // start setting up the Instructor
        Instructor.Wrap.style.display = 'block';
        Instructor.Content.innerHTML = _message;
        Instructor.Wrap.style.width = Instructor.I.width ? Instructor.I.width + 'px' : 'auto';
        if (!Instructor.I.width && Instructor.msie) {
            Instructor.Wrap.style.width = Instructor.Wrap.offsetWidth;
        }
        if (Instructor.Wrap.offsetWidth > Instructor.I.maxWidth) {
            Instructor.Wrap.style.width = Instructor.I.maxWidth + 'px';
        }
        Instructor.height = parseInt(Instructor.Wrap.offsetHeight) + Instructor.I.offsetTop;
        clearInterval(Instructor.Wrap.timer);
        Instructor.Wrap.timer = setInterval(function () {
            Instructor.fade(1);
        }, Instructor.I.timer);
        if (Instructor.I.boundingElement && Instructor.I.autoHide) {
            Instructor.I.boundingElement.setAttribute('onmouseout', 'Instructor.hide()');
        }
    },
    pos: function (_event) {
        // set up tweeners
        if (Instructor.I.tween) {
            // needed only for animated movement
            Instructor.yTween = new Tween(Instructor.Wrap.style, 'top', '', Instructor.Wrap.offsetTop, '', '', 'px');
            Instructor.xTween = new Tween(Instructor.Wrap.style, 'left', '', Instructor.Wrap.offsetLeft, '', '', 'px');
            Instructor.yTween.func = Tween.regularEaseOut;
            Instructor.xTween.func = Tween.regularEaseOut;
        }
        // get window width and height
        Instructor.uiY = Instructor.msie ? event.clientY + document.documentElement.scrollTop : _event.pageY;
        Instructor.uiX = Instructor.msie ? event.clientX + document.documentElement.scrollLeft : _event.pageX;
        Instructor.winWidth = document.body.offsetWidth || window.innerWidth;
        // if a container was set add it to the math
        var addedHeight = Instructor.I.boundingElement ? Instructor.I.boundingElement.offsetTop : 0;
        var addedWidth = Instructor.I.boundingElement ? Instructor.winWidth - (Instructor.I.boundingElement.offsetLeft + Instructor.I.boundingElement.offsetWidth) : 0;
        // check boundries and position the Instructor
        var yDest = (Instructor.uiY - Instructor.height - addedHeight > Instructor.I.boundries) ? (Instructor.uiY - Instructor.height) : (Instructor.uiY + Instructor.I.offsetTop);
        var xDest = (Instructor.winWidth - Instructor.uiX - Instructor.Wrap.offsetWidth - Instructor.I.offsetLeft - addedWidth < Instructor.I.boundries) ? (Instructor.uiX - Instructor.Wrap.offsetWidth - Instructor.I.offsetLeft) : (Instructor.uiX + Instructor.I.offsetLeft);
        if (Instructor.I.tween) {
            // animate
            Instructor.yTween.continueTo(yDest, 0.05);
            Instructor.xTween.continueTo(xDest, 0.05);
        } else {
            // move with no animation
            Instructor.Wrap.style.top = yDest + 'px'; // w/o a tween
            Instructor.Wrap.style.left = xDest + 'px'; // w/o a tween
        }
    },
    fade: function (direction, endFunction) {
        var alpha = Instructor.I.currentAlpha;
        if ((alpha !== Instructor.I.endAlpha && direction === 1) || (alpha !== 0 && direction === -1)) {
            var speed = Instructor.I.showSpeed;
            if (Instructor.I.endAlpha - alpha < Instructor.I.showSpeed && direction === 1) {
                speed = Instructor.I.endAlpha - alpha;
            } else if (Instructor.I.currentAlpha < Instructor.I.showSpeed && direction === -1) {
                speed = alpha;
            }
            Instructor.I.currentAlpha = alpha + (speed * direction);
            Instructor.Wrap.style.opacity = Instructor.I.currentAlpha * .01;
            Instructor.Wrap.style.filter = 'alpha(opacity=' + Instructor.I.currentAlpha + ')';
        } else {
            clearInterval(Instructor.Wrap.timer);
            if (direction === -1) {
                Instructor.Wrap.style.display = 'none';
            }
            if (endFunction) {
                endFunction();
            }
        }
    },
    hide: function (endFunction) {
        if (Instructor.Wrap === null) {
            return;
        }
        clearInterval(Instructor.Wrap.timer);
        Instructor.Wrap.timer = setInterval(function () {
            Instructor.fade(-1, endFunction);
        }, Instructor.I.timer);
    }
};


/* DOM add listener fork */
var addListener = (function () {
    var method = function (element) {
            if (typeof element.addEventListener === "function") {
                return function (element, event, func) {
                    element.addEventListener(event, func);
                };
            } else if (typeof element.attachEvent === "function") {
                return function (element, event, func) {
                    element.attachEvent("on" + event, func);
                };
            } else {
                return function (element, event, func) {
                    element["on" + event] = func;
                };
            }
        },
        fork;
    return function (element, event, func) {
        if (typeof fork !== "function") {
            fork = method(element);
        }
        fork(element, event, func);
        return element;
    };
} ());

/* Addition: one liner binding of the instructor */
Instructor.bind = function (element, text) {
    addListener(element, "mouseover", function () {
        Instructor.show(text);
    });
    addListener(element, "mouseout", function () {
        Instructor.hide();
    });
};