navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

(function (document) {
    var canvas = document.getElementById("droparea");
    var context = canvas.getContext("2d");
    var img = document.getElementById("guy");
    var video = document.getElementById("videoarea");
    var button = document.getElementById("save");
    var localMediaStream = null;

    canvas.width = 640;
    canvas.height = 480;

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
        video.style.display = "none";
        img.style.display = "none";
        canvas.style.display = "block";
        var image = new Image();
        image.onload = function() {
            var overlay = new Image();
            context.drawImage(image, 0, 0);
            overlay.onload = function () {
                context.drawImage(overlay, 0, 0);
                context.translate(640, 0);
                context.scale(-1, 1);
            }
            overlay.src = "assets/guyfawkes.png";
        };
        context.clearRect(0, 0, canvas.width, canvas.height);
        image.src = data;

    };
    var snap = function () {
        navigator.getUserMedia({ video: true },
            function (stream) {
                video.src = window.URL.createObjectURL(stream);
            }, function () {
                alert("error");
            });
    };
    var snapshot = function () {
        //if (localMediaStream) {
            context.drawImage(video, 0, 0);
            draw(canvas.toDataURL("image/webp"));
        //} else {
        //    alert("no localMediaStream");
        //}
    };

    button.onclick = function () {
        //canvas.toDataURL();
        png = canvas.toDataURL("image/png");

        window.open(png);
        //document.write('<img src="' + png + '"/>');
    };


    canvas.ondragover = allowDrop;
    canvas.ondrop = drop;


    document.getElementById("snap").addEventListener("click", snap, false);
    document.getElementById("capture").addEventListener("click", snapshot, false);


}(document));
