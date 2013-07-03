/////////////////////
/* odd & even rows */
/////////////////////
var oddAndEvenRows = function(){
    backgroundColor:false,//{odd:'#eaeaea',even:'#fff'}; // or false
    styleCreated:false,
    zebraClasses:function(class_name){
        if(!this.backgroundColor){
            this.createStyles();
        }
        class_name = class_name || '*';
        for(var i=0,containers=document.getElementsByClassName(class_name);i<containers.length;i++){
            this.zebraElement(containers[i]);
        }
    },
    zebraElement:function(e){
        if(!this.backgroundColor&&!this.styleCreated){
            this.createStyles();
        }
        var elemenets = new Array();
        for(var n=0,children=e.childNodes;n<children.length;n++){
            if(children[n].tagName){
                elemenets.push(children[n]);
            }
        }
        for(var n=0;n<elemenets.length;n++){
            if(this.backgroundColor){
                var color = (n%2==0) ? this.backgroundColor.odd : this.backgroundColor.even;
                elemenets[n].style.backgroundColor = color;
            }else{
                if(n%2==0){
                    classFunc.add(elemenets[n],'even');
                }else{
                    classFunc.add(elemenets[n],'odd');
                }
            }
        }
    },
    createStyles:function(){
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        var CSS = document.createTextNode('.odd{background:#eaeaea;} .even{background:#fff;}');
        style.type = 'text/css';
        if(style.styleSheet){
            style.styleSheet.cssText = CSS.nodeValue;
        }else{
            style.appendChild(CSS);
        }
        head.appendChild(style);
        this.styleCreated = true;
    }
}
/* -----------------------------------------------------------------------------
initiate this function for certain class names (if empty it just does this for all elements):
oddAndEvenRows.zebraClasses('oddAndEven');
initiate this function for a certain element:
oddAndEvenRows.zebraElement(document.getElementById('oddAndEven'));
----------------------------------------------------------------------------- */