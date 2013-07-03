//////////////////////////////////////
/* from objects array to table rows */
//////////////////////////////////////
var objectsHandler {
    htmlDataTag:'datafld',
/* tools */
    getKeys:function(obj){
        var objNames = new Array;
        for(var key in obj){
            if(obj.hasOwnProperty(key))
                objNames.push(key);
        }
        return objNames;
    },
    whereIn:function(obj,key){
        var returnKey = -1;
        for(var i=0,keysArr=this.getKeys(obj);i<keysArr.length;i++){
            if(key == keysArr[i])
                returnKey = i;
        }
        return returnKey;
    },
/* business logic */
    init:function(container,objectsArray){
        for(var i=0;i<=objectsArray.length-1;i++){
            this.duplicateAndPopulate(container,objectsArray[i]);
        }
        container.parentNode.removeChild(container);
    },
    duplicateAndPopulate:function(element,object){
        var parent = element.parentNode;
        var duplicate = element.cloneNode(true);
        this.populateRow(object,duplicate);
        parent.appendChild(duplicate);
    },
    populateRow:function(obj,container){
        var objArr = this.getKeys(obj);
        for(var i=0,tableRowChildren=container.getElementsByTagName('*');i<tableRowChildren.length;i++){
            this.htmlDataTag = tableRowChildren[i].getAttribute('datafld');
            if(this.htmlDataTag){
                if(this.whereIn(obj,this.htmlDataTag)!=-1){
                    var textNode = obj[objArr[this.whereIn(obj,this.htmlDataTag)]];
                    tableRowChildren[i].innerHTML = textNode;
                }
            }
        }
    }
}
/* -----------------------------------------------------------------------------
HTML example:
<table>
    <thead>
        <tr>
            <th>FIELD1</th>
            <th>FIELD2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span datafld="FIELD1"></span></td>
            <td><span datafld="FIELD2"></span></td>
        </tr>
    </tbody>
</table>
<script>
    var objectsArray = new Array({FIELD1:'hi',FIELD2:'there'},{FIELD1:'hello',FIELD2:'world'});
    var container = document.GetElementsByTagName('tbody')[0].GetElementsByTagName('tr')[0];
    objectsHandler.init(container,objectsArray);
</script>
 ----------------------------------------------------------------------------- */