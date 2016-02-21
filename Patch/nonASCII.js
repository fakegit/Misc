"use strict";

var events = require("sdk/system/events");
var id = require("sdk/self").id;

function onPreferenceChanged() {
  this.valueToPreference = function() {
    var string = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
    string.data = this.value;
    Services.prefs.setComplexValue(this.pref, Ci.nsISupportsString, string);
  };
  this.valueFromPreference = function() {
    this.value = Services.prefs.getComplexValue(this.pref, Ci.nsISupportsString).data;
  };
  this.valueFromPreference();
}

function objectToString(object) {
  return "(" + object.toString() + ").call(this);";
}

var patchQuery = ["setting[type=directory]", "setting[type=file]", "setting[type=string]"];
var patchEvent = objectToString(onPreferenceChanged);

function patchListener(event) {
  if (event.data == id) {
    var document = event.subject;
    var elements = document.querySelectorAll(patchQuery.join(","));
    for (var i in elements) {
      var element = elements[i];
      if (typeof element === "object") {
        element.setAttribute("onpreferencechanged", patchEvent);
      }
    }
  }
}

exports.startup = function () {
  events.on("addon-options-displayed", patchListener);
};
exports.shutdown = function () {
  events.off("addon-options-displayed", patchListener);
};
