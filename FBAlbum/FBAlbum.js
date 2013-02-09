/* EXAMPLE:
 * facebookAlbum('#FBAlbum', {
 *     'albumID': %id%
 * });
 */
var facebookAlbum = function (element, options) {
	if (!options.albumID) {
		return false;
	}
	var defaults = {
			'albumID': 0,
			'limit': 100,
			'callback': 'facebookAlbumInit',
			'overlayClassName': 'FBImageOverlay',
			'previewClassName': 'FBpreview',
			'loadingText': 'loading...'
		},
		element = typeof element === 'string' ? document.querySelector(element) : element,
		script = document.createElement('script'),
		fragment = document.createDocumentFragment(),
		style = document.createElement('style'),
		overlay = document.createElement('div'),
		loading = document.createTextNode(defaults.loadingText),
		image, // img DOM element
		enlarge, // function
		addListener; // function
		
	if (typeof window.addEventListener === 'function') {
        addListener = function (ele, evt, func) {
            return ele.addEventListener(evt, func);
        };
    } else if (typeof document.attachEvent === 'function') {
        addListener = function (ele, evt, func) {
            return ele.attachEvent('on' + evt, func);
        };
    } else {
        addListener = function (ele, evt, func) {
            ele['on' + evt] = func;
			return 0;
        };
    }
		
	for (var key in options) {
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
	}
	script.src = "https://graph.facebook.com/"+defaults.albumID+"/photos?limit="+defaults.limit+"&callback="+defaults.callback;
	document.body.appendChild(script);
	
	style.innerHTML = "." + defaults.previewClassName + "{cursor:pointer;}" +
					  "." + defaults.overlayClassName + " h3{margin-top:0;background:rgba(255,255,255,.7);}" +
					  "." + defaults.overlayClassName + " img{max-height:90%;border:3px solid white;border-radius:5px;box-shadow:0 0 10px black;}" +
					  "." + defaults.overlayClassName +  "{display:none;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;background:rgba(0,0,0,.7);}";
	document.head.appendChild(style);
	style = null;
	
	overlay.className = defaults.overlayClassName;
	addListener(overlay, 'click', function () {
		overlay.style.display = 'none';
		overlay.innerHTML = '';
	});
	document.body.appendChild(overlay);
	
	enlarge = function (data) {
		var title = document.createElement('h3'),
			name = data.name ? data.name : data.from.name,
			node = document.createTextNode(name),
			img = document.createElement('img');					
		title.appendChild(node);
		overlay.appendChild(title);
		img.className = defaults.imageClassName;
		img.src = data.source;
		overlay.style.display = 'block';
		overlay.appendChild(img);
	};
	element.appendChild(loading);
	
	window[defaults.callback] = function (result) {
		if (result.error) {
			var errorText = document.createTextNode('no data available');
			// console.log(result.error.message);
			element.removeChild(loading);
			element.appendChild(errorText);
			setTimeout(function () {
				element.removeChild(errorText);
			}, 2000);
			return;
		}
		var i = result.data.length;
		while (i--) {
			(function (num) {
				image = document.createElement('img');
				image.src = result.data[num].picture;
				image.className = defaults.previewClassName;
				addListener(image, 'click', function () {
					enlarge(result.data[num]);
				});
				fragment.appendChild(image);
				image = null;
			})(i);
		}
		element.removeChild(loading);
		element.appendChild(fragment);
		fragment = null;
		element.style.textAlign = 'center';
	};
};