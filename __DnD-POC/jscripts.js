;(function($) {
    "use strcit";
    $.fn.extend({
        jDnD: function (options) {
            if (typeof options.drop !== "function") {
                return false;
            }
            var ghost = null,
                targets = $("[role=\"dragTarget\"]"),
                jDoc = $(document),
                jBody = $(document.body),
                getTarget = function (event) {
                    event = event || window.event;
                    return event.target || event.srcElement;
                },
                indicateTarget = function (event) {
                    if (ghost !== null) {
                        $(getTarget(event)).closest("[role=\"dragTarget\"]").addClass("indicated");
                    }
                },
                indicateTargetEnd = function (event) {
                    $(getTarget(event)).closest("[role=\"dragTarget\"]").removeClass("indicated");
                },
                pos = function (event, ghost) {
                    var y = event.pageY || event.offsetY,
                        x = event.pageX || event.offsetX
                    return {
                        top: y - ghost.outerHeight() - 10 + "px",
                        left: x + 10 + "px"
                    };
                },
                drag = function (event) {
                    event = event || window.event;
                    if (ghost !== null) {
                        ghost.css(pos(event, ghost));
                    }
                },
                startDrag = function (event) {
                    event = event || window.event;
                    var target = getTarget(event),
                        jTarget = $(target);
                    if (jTarget.attr("role") === "dragObject") {
                        if (ghost !== null) {
                            ghost.remove();
                        }
                        ghost = $(target.cloneNode(true));
                        ghost.addClass("ghost");
                        jBody.append(ghost);
                        ghost.css(pos(event, ghost));
                        document.onmousemove = drag;
                        jDoc.bind("mousemove", drag);
                    }
                },
                drop = function (event) {
                    var target = $(getTarget(event)).closest("[role=\"dragTarget\"]")[0];
                    jDoc.unbind("mousemove", drag);
                    if (ghost !== null) {
                        ghost.remove();
                        if (target) {
                            debugger;
                            options.drop(ghost, $(target));
                        }
                        ghost = null;
                    }
                };
            targets.bind("mouseenter", indicateTarget);
            targets.bind("mouseleave", indicateTargetEnd);
            targets.bind("mouseup", indicateTargetEnd);

            this.bind("click", startDrag);
            jDoc.bind("mouseup", drop);
        }
    });
}(jQuery));