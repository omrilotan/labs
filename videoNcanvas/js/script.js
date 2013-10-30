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
    var rick = document.getElementById("rick");
    var localMediaStream = null;

    canvas.width = 640;
    canvas.height = 480;

    var allowDrop = function (event) {
        event.preventDefault();
    };
    var drop = function (event) {
        //debugger;
        var target = event.target;
        event.preventDefault();
        var data = event.dataTransfer.getData("text/uri-list");
        var image = new Image(640, 480);
        image.src = data;
        image.onload  = function () {
            context.drawImage(image, 0, 0);
            addmask();
        }
        /*
        console.log(data);
        var reader = new FileReader();
        reader.onload = function () {
            draw(reader.result);
        }
        reader.readAsDataURL(img);
        */
    };
    var addmask = function () {
        var overlay = new Image();
        overlay.onload = function () {
            context.drawImage(overlay, 0, 0);
            context.translate(640, 0);
            context.scale(-1, 1);
        }
        overlay.src = "assets/guyfawkes.png";
    };
    var draw = function (data) {
        video.style.display = "none";
        img.style.display = "none";
        canvas.style.display = "block";
        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 0, 0);
            addmask();
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
    img.ondragover = video.ondragover = function () {
        video.style.display = "none";
        canvas.style.display = "block";
    };
    canvas.ondrop = drop;

    rickdrag = {
        start: function (event) {
            event.target.style.opacity = "0.4";
        },
        enter: function (event) {
            event.target.classList.add("over");
        },
        over: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.dataTransfer.dropEffect = "move";
            return false;
        },
        leave: function (event) {
            event.target.classList.remove("over");
        },
        drop: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        },
        end: function (event) {
            event.target.classList.remove("over");
        }
    };

    document.getElementById("snap").addEventListener("click", snap, false);
    document.getElementById("capture").addEventListener("click", snapshot, false);
    rick.addEventListener("dragstart", rickdrag.start, false);
    rick.addEventListener("dragenter", rickdrag.enter, false);
    rick.addEventListener("dragover", rickdrag.over, false);
    rick.addEventListener("dragleave", rickdrag.leave, false);
    rick.addEventListener("drop", rickdrag.drop, false);
    rick.addEventListener("dragend", rickdrag.end, false);


}(document));
