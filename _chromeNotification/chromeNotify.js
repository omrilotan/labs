// Use Example:
// chromeNotify({
//     title: "Notification Title",
//     body: "Notification Body",
//     image: "",    // An image URL
//     callback: function () {}
// });
var chromeNotify = (function __chromeNotify__ () {
    var havePermission = 1;    // 0 means PERMISSION_ALLOWED
    var available = window.hasOwnProperty(webkitNotifications);
    if (available) {
        havePermission = window.webkitNotifications.checkPermission();
    }
    var ChromeNotification = function ChromeNotification () {};
    ChromeNotification.prototype.title = function ChromeNotification$title (str) {
        this.title = str;
        return this;
    };
    ChromeNotification.prototype.body = function ChromeNotification$body (str) {
        this.body = str;
        return this;
    };
    ChromeNotification.prototype.image = function ChromeNotification$image (str) {
        this.image = str;
        return this;
    };
    ChromeNotification.prototype.callback = function ChromeNotification$callback (fn) {
        this.callback = fn;
        return this;
    };
    ChromeNotification.prototype.notify = function ChromeNotification$notify () {
        if (available && havePermission !== 0) {
            window.webkitNotifications.requestPermission();
        } else {
            var callback = this.callback;
            this.notification = window.webkitNotifications.createNotification(
                this.image,
                this.title,
                this.body
            );
            this.notification.onclick = function () {
                callback();
                notification.close;
            };
            this.notification.show();
        }
    };
    return function chromeNotify (obj) {
        obj = obj || {};
        obj.title = obj.title || "Notification from " + window.location.origin;
        obj.body = obj.body || "Click here to do something";
        obj.image = obj.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAACICAMAAAALZFNgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA4QjNEQjA0RDMwMTFFMzk3NUZBNzY2QjgyODQwQ0EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA4QjNEQjE0RDMwMTFFMzk3NUZBNzY2QjgyODQwQ0EiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDhCM0RBRTREMzAxMUUzOTc1RkE3NjZCODI4NDBDQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDhCM0RBRjREMzAxMUUzOTc1RkE3NjZCODI4NDBDQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pof0DeYAAAAGUExURQAAAP///6XZn90AAAACdFJOU/8A5bcwSgAAAHFJREFUeNrs2qENAAAIA7Dx/9MILsAR0umJSkKWOpKAgICAgIBMfRMQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ600QEBAQEJDjEPcICAgICAgICAgIiB8aCAgICMh7SAswAIv8Nwc4Sa7dAAAAAElFTkSuQmCC";
        obj.callback = obj.callback || function () {
            alert("No action was defined");
        };
        (new ChromeNotification())
                .title(obj.title)
                .body(obj.body)
                .image(obj.image)
                .callback(obj.callback)
                .notify();
    };
}());