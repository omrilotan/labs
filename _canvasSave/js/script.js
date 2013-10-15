(function (document) {
    var canvas = document.getElementById("droparea");
    var button = document.getElementById("save");
    var allowDrop = function (event) {
        event.preventDefault();
    };
    var drop = function (event) {
        var target = event.target;
        event.preventDefault();
        var data = event.dataTransfer;
        var reader = new FileReader();
        [].forEach.call(data.files, function (file) {
            reader.onload = function () {
                draw(reader.result);
            }
            reader.readAsDataURL(file);
        });
    };
    var draw = function (data) {
        var context = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 200;
        var image = new Image();
        var overlay = new Image();
        overlay.src = "/RESOURCES/overlay.png";
        image.onload = function() {
            context.drawImage(image, 0, 0);
        };
        overlay.onload = function () {
            setTimeout(function () {
                context.drawImage(overlay, 0, 0);
            }, 1000);
        };
        context.clearRect(0, 0, canvas.width, canvas.height);
        image.src = data;

    };

    button.onclick = function () {
        //canvas.toDataURL();
        png = canvas.toDataURL("image/png");

        window.open(png);
        //document.write('<img src="' + png + '"/>');
    };


    canvas.ondragover = allowDrop;
    canvas.ondrop = drop;


}(document));