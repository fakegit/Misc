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

function functionToString(object) {
  return "(" + object.toString() + ").call(this);";
}

function eventListener(event) {
  if (event.data != id) return;

  var document = event.subject;
  var array = document.querySelectorAll("setting[type=directory],setting[type=file],setting[type=string]");
  array.forEach(function (option) {
    if (typeof option === "object") {
      option.setAttribute("onpreferencechanged", functionToString(onPreferenceChanged));
    }
  });
}

exports.on = function () {
  events.on("addon-options-displayed", eventListener);
};
exports.off = function () {
  events.off("addon-options-displayed", eventListener);
};
