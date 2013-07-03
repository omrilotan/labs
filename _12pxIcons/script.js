///////////////////////////////////////////////////////
/* 12px single colour icon set, with opacity shading */
///////////////////////////////////////////////////////
var iconSet = function () {
    "use strict";
    var iconSize = 12,
        theme = "#666", // default colour if not set differently
        color,
        inlineCss = true, // if set to false, adds style tag to document head instead
        styleInHead = false,
        set = {};
    return {
        toDoubleDigit: function (num){
            return (num < 10) ? "0" + num : num;
        },
        line: function (str, row) {
            var htmlArray = [],
                len = str.length,
                i = 0,
                colorStyle,
                style;
            for (; i < len; i++) {
                colorStyle = color === theme ?
                        " background:" + theme + "; " :
                        " background:" + color + "; ";
                if (inlineCss === true) {
                    style = " style=\"position:absolute; width:1px; height:1px; " + colorStyle + " top:" + row + "px; left:" + i + "px; opacity:" + (str[i] / 10) + "; filter:alpha(opacity=" + (str[i] * 10) + ");\"";
                } else if (color !== theme && inlineCss === false){
                    style = " style=\"" + colorStyle + ";\" class=\"opacity" + iconSet.toDoubleDigit(str[i]) + " cell" + iconSet.toDoubleDigit(i) + " row" + iconSet.toDoubleDigit(row) + "\"";
                } else if (isNaN(str[i]) === false && inlineCss === false) {
                    style = " class=\"opacity" + iconSet.toDoubleDigit(str[i]) + " cell" + iconSet.toDoubleDigit(i) + " row" + iconSet.toDoubleDigit(row) + "\"";
                } else if (str[i] === "X" && inlineCss === false) {
                    style = " class=\"cell" + iconSet.toDoubleDigit(i) + " row" + iconSet.toDoubleDigit(row) + "\"";
                } else {
                    style = "";
                }
                htmlArray.push("<span" + style + "></span>");
            }
            return htmlArray.join("");
        },
        lines: function (str) {
            var htmlArray = [],
                i = 0,
                lineStr,
                n;
            for(; i < iconSize; i++) {
                lineStr = "";
                for(n = 0; n < iconSize; n++) {
                    lineStr += str[(i * iconSize) + n];
                }
                htmlArray.push(iconSet.line(lineStr, i));
            }
            return htmlArray.join("");
        },
        span: function (str) {
            var style = inlineCss === false ?
                    " class=\"iconSet\"" :
                    " style=\"display:inline-block;margin:0;padding:0;border:0;width:12px;height:12px;position:relative;\"";
            return "<span" + style + ">" + iconSet.lines(str) + "</span>";
        },
        style:function(){
            var cssArray = [],
                i = 0;
            cssArray.push(".iconSet,.iconSet *{display:inline-block;margin:0;padding:0;border:0;}");
            cssArray.push(".iconSet{width:12px;height:12px;position:relative;}");
            cssArray.push(".iconSet span{position:absolute;width:1px;height:1px;background:" + theme + ";}");
            for(i = 0; i < iconSize; i++) {
                cssArray.push(".iconSet .row" + iconSet.toDoubleDigit(i) + "{top:" + i + "px;}");
                cssArray.push(".iconSet .cell" + iconSet.toDoubleDigit(i) + "{left:" + i + "px;}");
            }
            for(i = 0; i < 10; i++) {
                cssArray.push(".iconSet .opacity" + iconSet.toDoubleDigit(i) + "{");
                cssArray.push("opacity:" + (i / 10) + ";");
                cssArray.push("filter:alpha(opacity=" + (i * 10) + ")");
                cssArray.push("}");
            }       
            var headElement = document.getElementsByTagName("head")[0];
            var styleElement = document.createElement("style");
            var cssText = document.createTextNode(cssArray.join("\n"));
            styleElement.appendChild(cssText);
            headElement.appendChild(styleElement);
        },
        add: function (icon_name, stringRepresentation) {
            set[icon_name] = stringRepresentation;
        },
        write: function (icon_name, varcolor) {
            if (styleInHead !== true && inlineCss !== true) {
                iconSet.style();
                styleInHead = true;
            }
            color = varcolor || theme;
            if (set.hasOwnProperty(icon_name)) {
                return iconSet.span(set[icon_name]);
            }
        }
    };
}();

iconSet.add("plus", [
    "000000000000",
    "0000XXX00000",
    "0000XXX00000",
    "0000XXX00000",
    "0XXXXXXXXX00",
    "0XXXXXXXXX00",
    "0XXXXXXXXX00",
    "0000XXX00000",
    "0000XXX00000",
    "0000XXX00000",
    "000000000000",
    "000000000000"
].join(""));

iconSet.add("minus", [
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "0XXXXXXXXX00",
    "0XXXXXXXXX00",
    "0XXXXXXXXX00",
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000",
    "000000000000"
].join(""));

iconSet.add("disc", [
    "0036XXXX6300",
    "06XXXXXXXX60",
    "3XXXXXXXXXX3",
    "6XXXXXXXXXX6",
    "XXXXXXXXXXXX",
    "XXXXXXXXXXXX",
    "XXXXXXXXXXXX",
    "XXXXXXXXXXXX",
    "6XXXXXXXXXX6",
    "3XXXXXXXXXX3",
    "06XXXXXXXX60",
    "0036XXXX6300"
].join(""));

iconSet.add("forward", [
    "0036XXXX6300",
    "06XXXXXXXX60",
    "3XXXXXXXXXX3",
    "6XXXX0XXXXX6",
    "XXXXX00XXXXX",
    "XXXXX000XXXX",
    "XXXXX000XXXX",
    "XXXXX00XXXXX",
    "6XXXX0XXXXX6",
    "3XXXXXXXXXX3",
    "06XXXXXXXX60",
    "0036XXXX6300"
].join(""));

iconSet.add("backward", [
    "0036XXXX6300",
    "06XXXXXXXX60",
    "3XXXXXXXXXX3",
    "6XXXXX0XXXX6",
    "XXXXX00XXXXX",
    "XXXX000XXXXX",
    "XXXX000XXXXX",
    "XXXXX00XXXXX",
    "6XXXXX0XXXX6",
    "3XXXXXXXXXX3",
    "06XXXXXXXX60",
    "0036XXXX6300"
].join(""));

iconSet.add("fastforward", [
    "0036XXXX6300",
    "06XXXXXXXX60",
    "3XXXXXXXXXX3",
    "6XX0XX0XXXX6",
    "XXX00X00XXXX",
    "XXX000000XXX",
    "XXX000000XXX",
    "XXX00X00XXXX",
    "6XX0XX0XXXX6",
    "3XXXXXXXXXX3",
    "06XXXXXXXX60",
    "0036XXXX6300"
].join(""));

iconSet.add("rewind", [
    "0036XXXX6300",
    "06XXXXXXXX60",
    "3XXXXXXXXXX3",
    "6XXXX0XX0XX6",
    "XXXX00X00XXX",
    "XXX000000XXX",
    "XXX000000XXX",
    "XXXX00X00XXX",
    "6XXXX0XX0XX6",
    "3XXXXXXXXXX3",
    "06XXXXXXXX60",
    "0036XXXX6300"
].join(""));

iconSet.add("X", [
    "000000000000",
    "000000000000",
    "0XXX000XXX00",
    "00XXX0XXX000",
    "000XXXXX0000",
    "0000XXX00000",
    "0000XXX00000",
    "000XXXXX0000",
    "00XXX0XXX000",
    "0XXX000XXX00",
    "000000000000",
    "000000000000"
].join(""));