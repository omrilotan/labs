window.CSSHover = (function(){
    var REG_INTERACTIVE = /(^|\s)((([^a]([^ ]+)?)|(a([^#.][^ ]+)+)):(hover|active|focus))/i,
        REG_AFFECTED = /(.*?)\:(hover|active|focus)/i,
        REG_PSEUDO = /[^:]+:([a-z-]+).*/i,
        REG_SELECT = /(\.([a-z0-9_-]+):[a-z]+)|(:[a-z]+)/gi,
        REG_CLASS = /\.([a-z0-9_-]*on(hover|active|focus))/i,
        REG_MSIE = /msie (5|6|7)/i,
        REG_COMPAT = /backcompat/i;
    var CSSHOVER_PREFIX = 'csh-';
    var CSSHover = {
        elements: [],
        callbacks: {},
        init:function() {
            if(!REG_MSIE.test(navigator.userAgent) && !REG_COMPAT.test(window.document.compatMode)) return;
            var sheets = window.document.styleSheets, l = sheets.length;
            for(var i=0; i&lt;l; i++) {
                this.parseStylesheet(sheets[i]);
            }
        },
        parseStylesheet:function(sheet) {
            if(sheet.imports) {
                try {
                    var imports = sheet.imports, l = imports.length;
                    for(var i=0; i&lt;l; i++) {
                        this.parseStylesheet(sheet.imports[i]);
                    }
                } catch(securityException){}
            }
            try {
                var rules = sheet.rules, l = rules.length;
                for(var j=0; j&lt;l; j++) {
                    this.parseCSSRule(rules[j], sheet);
                }
            } catch(securityException){}
        },
        parseCSSRule:function(rule, sheet) {
            var select = rule.selectorText;
            if(REG_INTERACTIVE.test(select)) {
                var style = rule.style.cssText,
                    affected = REG_AFFECTED.exec(select)[1],
                    pseudo = select.replace(REG_PSEUDO, 'on$1'),
                    newSelect = select.replace(REG_SELECT, '.$2' + pseudo),
                    className = REG_CLASS.exec(newSelect)[1];
                var hash = affected + className;
                if(!this.callbacks[hash]) {
                    sheet.addRule(affected, CSSHOVER_PREFIX + className + ':expression(CSSHover(this, "'+pseudo+'", "'+className+'"))');
                    this.callbacks[hash] = true;
                }
                sheet.addRule(newSelect, style);
            }
        },
        patch:function(node, type, className) {
            var property = CSSHOVER_PREFIX + className;
            if(node.style[property]) {
                node.style[property] = null;
            }
            if(!node.csshover) node.csshover = [];
            if(!node.csshover[className]) {
                node.csshover[className] = true;
                var element = new CSSHoverElement(node, type, className);
                this.elements.push(element);
            }
            return type;
        },
        unload:function() {
            try {
                var l = this.elements.length;
                for(var i=0; i&lt;l; i++) {
                    this.elements[i].unload();
                }
                this.elements = [];
                this.callbacks = {};
            } catch (e) {
            }
        }
    };
    window.attachEvent('onbeforeunload', function(){
        CSSHover.unload();
    });
    var CSSEvents = {
        onhover:  { activator: 'onmouseenter', deactivator: 'onmouseleave' },
        onactive: { activator: 'onmousedown',  deactivator: 'onmouseup' },
        onfocus:  { activator: 'onfocus',      deactivator: 'onblur' }
    };
    function CSSHoverElement(node, type, className) {
        this.node = node;
        this.type = type;
        var replacer = new RegExp('(^|\\s)'+className+'(\\s|$)', 'g');
        this.activator =   function(){ node.className += ' ' + className; };
        this.deactivator = function(){ node.className = node.className.replace(replacer, ' '); };
        node.attachEvent(CSSEvents[type].activator, this.activator);
        node.attachEvent(CSSEvents[type].deactivator, this.deactivator);
    }
    CSSHoverElement.prototype = {
        unload:function() {
            this.node.detachEvent(CSSEvents[this.type].activator, this.activator);
            this.node.detachEvent(CSSEvents[this.type].deactivator, this.deactivator);
            this.activator = null;
            this.deactivator = null;
            this.node = null;
            this.type = null;
        }
    };
    return function(node, type, className) {
        if(node) {
            return CSSHover.patch(node, type, className);
        } else {
            CSSHover.init();
        }
    };
})();