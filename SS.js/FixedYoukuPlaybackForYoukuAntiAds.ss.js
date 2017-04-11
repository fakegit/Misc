"use strict";

/*
version: 20170411-1613
require: 1.0.1
*/
exports.on = startup;

function startup() {
  var PageMod = require("sdk/page-mod");
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
