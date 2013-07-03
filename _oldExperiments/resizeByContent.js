////////////////////////////////
/* content aware DOM elements */
////////////////////////////////
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0;i<this.length;i++){
            if(this[i]==obj)
                return i;
        }
        return -1;
    }
}
var contentAwareness = {
    textarea:{
        minHeight: 100, // default minimum height
        init:function(class_name,minHeight){
            this.class_name = class_name || false;
            this.minHeight = minHeight || this.minHeight;
            for(var i=0,textareas=document.getElementsByTagName('textarea');i<textareas.length;i++){
                if(class_name && textareas[i].className.indexOf(class_name)==-1){
                    // do nothing
                }else{
                    textareas[i].setAttribute('onkeydown','contentAwareness.textarea.investigate(this)'); // FF
                    textareas[i].onkeydown = function(){contentAwareness.textarea.investigate(this)} // IE
                }
            contentAwareness.textarea.investigate(textareas[i]);
            }
        },
        investigate:function(e){
            body = document.body || document.getElementsaByTagName('BODY')[0];
            this.reflector = document.createElement('div');
            this.reflector.style.width = e.offsetWidth+'px';
            this.reflector.style.whiteSpace = 'pre-wrap';
            if(this.class_name){
                this.reflector.className = this.class_name;
            }else{
                e.style.font = this.reflector.style.font = 'normal 13px/16px Arial';
            }
            body.appendChild(this.reflector);
            if(navigator.userAgent.indexOf('MSIE')!=-1){
                this.text = document.createTextNode(e.value.replace(/\r/g,'')+'\r ');
                this.reflector.appendChild(this.text);
            }else{
                this.reflector.innerHTML = e.value.replace(/\r/g,'')+'\r ';
            }
            e.style.height = (this.reflector.offsetHeight>this.minHeight) ? this.reflector.offsetHeight+'px' : this.minHeight+'px';
            body.removeChild(this.reflector);
        }
    }
}