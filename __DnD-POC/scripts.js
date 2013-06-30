(function () {
    var ghost = null,
        targets = document.querySelectorAll(".target"),
        indicateTarget = function (event) {
            if (ghost !== null) {
                event.target.classList.add("indicated");
            }
        },
        indicateTargetEnd = function (event) {
            if (ghost !== null) {
                event.target.classList.remove("indicated");
            }
        },
        drag = function (event) {
            if (ghost !== null) {
                ghost.style.top = event.pageY - ghost.offsetHeight - 10 + "px";
                ghost.style.left = event.pageX + 10 + "px";
            }
        },
        startDrag = function (event) {
            if (event.target.classList.contains("draggable")) {
                ghost = event.target.cloneNode(true);
                ghost.style.position = "absolute";
                ghost.classList.add("ghost");
                document.body.appendChild(ghost);
                ghost.style.top = event.pageY - ghost.offsetHeight - 10 + "px";
                ghost.style.left = event.pageX + 10 + "px";
                window.addEventListener("mousemove", drag, false);
                document.body.classList.add("dragging");
            }
        },
        drop = function (event) {
            window.removeEventListener("mousemove", drag, false);
            if (ghost !== null) {
                document.body.removeChild(ghost);
                if (event.target.classList.contains("target")) {
                    event.target.style.background = ghost.getAttribute("data-color");
                    event.target.setAttribute("data-color", ghost.style.background);
                }
                ghost = null;
            }
            document.body.classList.remove("dragging");
        },
        i = 0,
        loops = targets.length;
    for (; i < loops; i++) {
        targets[i].addEventListener("mouseenter", indicateTarget, false);
        targets[i].addEventListener("mouseleave", indicateTargetEnd, false);
        targets[i].addEventListener("mouseup", indicateTargetEnd, false);
    }
    
    document.querySelector("nav").addEventListener("click", startDrag, false);
    window.addEventListener("mouseup", drop, false);
}());