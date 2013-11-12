//////////////////////
/* get DOM elements */
//////////////////////
if (typeof document.getElementsByClassName !== "function") {
    document.getElementsByClassName = function(class_name) {
        var elementsArr = [],
            elements = this.all || this.getElementsByTagName("*"),
            pattern = new RegExp("(^|\\s)" + class_name + "(\\s|$)"),
            len = elements.length,
            i = 0;
        for(; i < len; i++) {
            if (pattern.test(elements[i].className)) {
                elementsArr.push(elements[i]);
            }
        }
        return elementsArr;
    }
}
// get all form elements within an element or in the body (default)
var getFormFields = function (e) {
    e = e || document.getElementsByTagName("body")[0];
    var elementsArr = [],
        tagsArray = ["input", "textarea", "select"],
        elements=e.getElementsByTagName("*"),
        len = elements.length,
        i = 0;
    for (; i < len; i++) {
        if (tagsArray.indexOf(elements[i].tagName.toLowerCase()) !== -1) {
            elementsArr.push(elements[i]);
        }
    }
    return elementsArr;
}
// get element by partial ID by specific tag or by all (default)
var findByPartialID = function (string, tag_name) {
    var arr = document.getElementsByTagName(tag_name),
        len = arr.length,
        i = 0;
    tag_name = tag_name || "*";
    for (; i < len; i++) {
        if (arr[i].id) {
            if (arr[i].id.indexOf(string) !== -1) {
                return arr[i];
            }
        }
    }
    return null;
}