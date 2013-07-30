var div = document.getElementById("test");
var Obj = function (id) {
    this.element = document.getElementById(id);
    this.body = document.body;
};

var tester = new Obj("test");

div.classList.remove("stam");

alert(tester.element.id);

document.body.classList.remove("hi");


alert(document.body.id);