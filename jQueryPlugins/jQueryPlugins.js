/*!
 * get the dimentions of a scrollbar (in pixels)
 */
$.scrollbarDimension = (function () {
    var parent,
        child,
        width,
        height;
    return function () {
        if (width === undefined || height === undefined) {
            parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
            child = parent.children();
            width = child.innerWidth() - child.height(99).innerWidth();
            height = child.innerWidth() - child.height(99).innerWidth();
            parent.remove();
            // clear references
            child = null;
            parent = null;
        }
        return {
            width: width,
            height: height 
        };
    };
})();
/*!
 * make the input responsive to content
 *
 * custom options: maxWidth, minWidth, padding
 */
$.fn.autoStretchInput = function (o) {
    // set default values
    o = $.extend({
        maxWidth: 200,
        minWidth: 0,
        padding: 5
    }, o);
    this.filter('input:text').each(function () {
        // replicate the text input in order to measure it
        var minWidth = o.minWidth || $(this).width(),
	val = '',
	input = $(this),
	inputReplica = $('<stretcher/>').css({
	    position: 'absolute', top: -9999, left: -9999,
	    fontSize: input.css('fontSize'), fontFamily: input.css('fontFamily'), fontWeight: input.css('fontWeight'),
	    width: 'auto', letterSpacing: input.css('letterSpacing'), whiteSpace: 'nowrap'
	}),
	check = function () {
	    if (val === (val = input.val())) { return; }
	    // enter the content into the replica
	    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    inputReplica.html(escaped);
	    // calc new width and whether to change or not
	    var stretcherWidth = inputReplica.width(),
			newWidth = (stretcherWidth + o.padding) >= minWidth ? stretcherWidth + o.padding : minWidth,
			currentWidth = input.width(),
			isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth) || (newWidth > minWidth && newWidth < o.maxWidth);
	    // change width
	    if (isValidWidthChange) {
	        input.width(newWidth);
	    }
	};
        $(document.body).append(inputReplica);
        $(this).bind('keyup keydown blur update ready load change', check);
    });
    return this;
};
/*!
 * get the recursive value of a number value propery (like offsetTop)
 */
$.fn.getRecursiveAttribute = function (attribute) {
    var _element = this,
        accumulatedValue = 0,
        parent = _element.parent();
    while (parent.length > 0) {
        parent = _element.parent();
        if (parent[0].tagName.toLowerCase() == 'body')
            break;
        accumulatedValue += _element.attr(attribute);
        _element = parent;
    }
    return accumulatedValue;
};

