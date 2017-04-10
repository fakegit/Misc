"use strict";

exports.version = "1.0.0";  //not functional
exports.on = youkuStyleSheet;

var PageMod = require("sdk/page-mod");

function youkuStyleSheet() {
  PageMod.PageMod({
    include: "*.youku.com",
    contentStyle: ""
    + ".danmuoff .vpactionv5_iframe_wrap {"
    +   "top: auto !important;"
    + "}"
    + ""
    + ".play_area{"
    +   "margin-bottom: 70px !important;"
    + "}"
  });
}
