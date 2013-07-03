var ellipsis = {
    charactersToRemove: 1, // each time. 1 being the minimum
    isOptions: false,
    roundDown: 0,
    trimOptions: function (arr, w) {
        w = w || false;
        this.isOptions = true;
        this.roundDown = 5;
        for (var i = 0; i < arr.length; i++) {
            this.trim(arr[i], w);
        }
        this.isOptions = false;
        this.roundDown = 0;
    },
    trimArray: function (arr, w, h) {
        w = w || false;
        h = h || false;
        for (var i = 0; i < arr.length; i++) {
            this.trim(arr[i], w, h);
        }
    },
    trim: function (e, w, h, t) {
        w = w || e.offsetWidth;
        h = h || false;
        t = t || this.removeHTMLTags(e.innerHTML);
        e.innerHTML = '';
        s = document.createElement('span');
        if (!h)
            s.style.whiteSpace = 'nowrap';
        if (e.title == '')
            e.title = t;
        e.style.maxWidth = w + 'px';
        tn = document.createTextNode(t);
        s.appendChild(tn);
        if (this.isOptions === true) {
            document.body.appendChild(s);
        } else {
            e.appendChild(s);
        }
        condition = s.offsetWidth + this.roundDown > w && t.length > (3 + this.charactersToRemove);
        if (h) {
            condition = (s.offsetWidth > w || s.offsetHeight > h) && t.length > (3 + this.charactersToRemove);
        }
        if (condition === true) {
            t = t.substring(0, t.length - 3 - this.charactersToRemove) + '...';
            if (this.isOptions === true) {
                document.body.removeChild(s);
                e.innerHTML = t;
            }
            this.trim(e, w, h, t);
        } else if (s.offsetWidth + this.roundDown > w) {
            t = '...'; // '…';
        } else {
            if (this.isOptions === true) {
                e.innerHTML = t;
            }
        }
    },
    removeHTMLTags: function (str) {
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        var strTagStripped = str.replace(/<\/?[^>]+(>|$)/g, '');
        return strTagStripped;
    }
}
//////////////////////////////////////////////////////////////////////////////////
//class init: ellipsis.trimArray(document.getElementsByClassName('class_name'));//
//single init: ellipsis.trim(element);                                          //
//////////////////////////////////////////////////////////////////////////////////