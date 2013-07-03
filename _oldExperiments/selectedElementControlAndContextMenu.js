//////////////////////////////
/* selected element control */
//////////////////////////////
var elemSelect = function(){
    var topElement = 'body'; // replace if you want a different top element (div, tr, etc.)
    return{
        InElement:function(target,e){
            if(target==e)
                target.isIn = true;
            if(e.childNodes.length&gt;0){
                for(var i=0;i&lt;e.childNodes.length;i++){
                    if(target==e.childNodes[i]){
                        target.isIn = true;
                    }else{
                        isIn = elemSelect.InElement(target,e.childNodes[i]);
                    }
                }
            }
            return target ? target.isIn : false;
        },
        toggleTopElement:function(target,container){
            if(target &amp;&amp; elemSelect.InElement(target,container)){
                if(target==container){
                    return;
                }else if(target.tagName &amp;&amp; target.tagName.toLowerCase()==topElement){
                    elemSelect.toggle(target);
                }else{
                    elemSelect.toggleTopElement(target.parentNode,container);
                }
            }
        },
        markTopElement:function(target,container){
            if(target &amp;&amp; elemSelect.InElement(target,container)){
                if(target==container){
                    return;
                }else if(target.tagName &amp;&amp; target.tagName.toLowerCase()==topElement){
                    elemSelect.mark(target);
                }else{
                    elemSelect.mark(target.parentNode,container);
                }
            }
        },
        toggle:function(e){
            var itemsCollection = document.getElementsByTagName(topElement);
            for(var i=0;i&lt;itemsCollection.length;i++){
                if(itemsCollection[i]!=e){
                    classFunc.remove(itemsCollection[i],'selected');
                }else{
                    classFunc.toggle(itemsCollection[i],'selected');
                }
            }
        },
        mark:function(e){
            var itemsCollection = document.getElementsByTagName(topElement);
            for(var i=0;i&lt;itemsCollection.length;i++){
                if(itemsCollection[i]!=e){
                    classFunc.remove(itemsCollection[i],'selected');
                }else{
                    classFunc.add(itemsCollection[i],'selected');
                }
            }
        },
        unMarkAll:function(){
            var itemsCollection = document.getElementsByTagName(topElement);
            for(var i=0;i&lt;itemsCollection.length;i++){
                classFunc.remove(itemsCollection[i],'selected');
            }
        }
    };
}();
/* ------------------- mouse event.button (s) ---------------
/////////////////////////////////////////////////////////////
//    Browser | Left Click | Middle Click | Right Click
//    ___________________________________________________
//       FF   :      0             1             2
//       IE   :      1             4             2
/////////////////////////////////////////////////////////////
---------------------------------------------------------- */
var AutoMouseClick = function(){
    var container;
    var _divContext;
    var _replaceContext = false;
    var _mouseOverContext = false;
    var _noContext = false;
    var offsetY = 0; //optional manual fix
    var offsetX = 0; //optional manual fix
    return{
        InitContext:function(container){
            container.appendChild(ContextMenuController.createContextMenu());
            _divContext = ContextMenuController.createContextMenu();
/* set up click and context menu calls replacement */
            document.body.oncontextmenu = AutoMouseClick.ContextShow;
            document.body.onmousedown = AutoMouseClick.ContextMouseDown;
            _divContext.onmouseover = function(){ _mouseOverContext = true; };
            _divContext.onmouseout = function(){ _mouseOverContext = false; };
        },
        ContextMouseDown:function(event){
            if(_noContext || _mouseOverContext)
                return;
            if(event==null){ event=window.event; }// IE fix: pass event object
            var target = event.target!=null ? event.target : event.srcElement; // IE fix: target
            if(event.button==2 &amp;&amp; elemSelect.InElement(target,container)){
                elemSelect.markTopElement(target,container);
                _replaceContext = true;
            }else if(event.button==1 || event.button==0 &amp;&amp; elemSelect.InElement(target,container)){
                /* in IE only left click, in FF both left and middle click */
                elemSelect.toggleTopElement(target,container);
                _divContext.style.display = 'none';
            }else if(!_mouseOverContext){
                _divContext.style.display = 'none';
            }else{
                elemSelect.unMarkAll();
                _divContext.style.display = 'none';
                
            }
        },
        CloseContext:function(){
            _mouseOverContext = false;
            _divContext.style.display = 'none';
        },
        ContextShow:function(event){
            if(_noContext || _mouseOverContext)
                return;
            if(event==null){ event=window.event; }// IE fix: pass event object
            var target = event.target!=null ? event.target : event.srcElement; // IE fix: target
            if(_replaceContext){
                // IE lookup: document.body.scrollTop and Left
                var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
                var scrollLeft = document.body.scrollLeft ? document.body.scrollLeft : document.documentElement.scrollLeft;
                
                _divContext.style.display = 'block';
                _divContext.style.visibility = 'hidden';
                if(!offsetX)
                    offsetX=0;
                var xPos = event.clientX+scrollLeft+offsetX;
                
                if(xPos+_divContext.offsetWidth&gt;container.offsetWidth){
                    xPos = xPos-(xPos+_divContext.offsetWidth-container.offsetWidth);
                }
                _divContext.style.left = xPos+'px';
                
                if(!offsetY)
                    offsetY=0;
                yPos = event.clientY+scrollTop+offsetY;
                if(yPos+_divContext.offsetHeight&gt;container.offsetHeight){
                    yPos = yPos-(yPos+_divContext.offsetHeight-container.offsetHeight);
                }
                _divContext.style.top = yPos+'px';
                
                _divContext.style.visibility = 'visible';
                
                _replaceContext = false;
                return false;
            }
        },
        DisableContext:function(){
            _noContext = true;
            AutoMouseClick.CloseContext();
            return false;
        },
        EnableContext:function(){
            _noContext = false;
            _mouseOverContext = false;
            return false;
        }
    };
}();
//////////////////////
/* the context menu */
//////////////////////
var ContextMenuController = function(){
    var myContextMenu = document.createElement('div');
    var ContextMenuHtml;
    return{
        createContextMenu:function(){
            myContextMenu.className = 'contextMenu';
            myContextMenu.style.display = 'none';
            myContextMenu.style.position = 'absolute';
            myContextMenu.style.zIndex = '999';
            myContextMenu.innerHTML = ContextMenuController.fillContextMenu();
            return myContextMenu;
        },
        fillContextMenu:function(){
            ContextMenuHtml = "";
            ContextMenuHtml += "&lt;a href='javascript:void(0);'&gt;this is&lt;/a&gt;";
            ContextMenuHtml += "&lt;span class='disabled'&gt;the content&lt;/span&gt;";
            ContextMenuHtml += "&lt;a href='javascript:void(0);'&gt;of your new context menu&lt;/a&gt;";
            ContextMenuHtml += "";
            return ContextMenuHtml;
        }
    }
}();
/*-------------------------------------------
launch at document:
AutoMouseClick.InitContext($element);
-------------------------------------------*/