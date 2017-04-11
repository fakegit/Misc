"use strict";

/*
version: 20170411-1613
require: 1.0.0
*/
exports.on = startup;
exports.off = shutdown;

var {Cc, Ci, Cr, Cu} = require('chrome')
var {TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
var {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm", {});
var window = require('sdk/window/utils').getMostRecentBrowserWindow("navigator:browser");

var Storage = {};

var Services = {
  pps: Cc["@mozilla.org/network/protocol-proxy-service;1"].getService(Ci.nsIProtocolProxyService),
  prefs: Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).QueryInterface(Ci.nsIPrefBranch)
};

var FileIO = {
  folder: OS.Path.join(OS.Constants.Path.profileDir, "SimpleProxy"),
  joinPath: function (base, addon) {
    return OS.Path.join(base, addon);
  },
  makeFolder: function (path) {
    OS.File.makeDir(path);
  },
  moveFile: function (object, target) {
    OS.File.move(object, target);
  },
  pathFileName: function (path) {
    var data = OS.Path.split(Storage[i].list).components;
    return data[data.length - 1];
  },
  uriFileName: function (uri) {
    var data = uri.split("/");
    return data[data.length - 1];
  },
  fileInfo: function (storage, callback) {
    OS.File.stat(storage.file).then(
      function onSuccess(data) {
        storage.date = Date.parse(data.lastModificationDate), storage.fetch = false;
        callback(storage);
      },
      function onFailure(reason) {
        if (reason instanceof OS.File.Error && reason.becauseNoSuchFile) {
          storage.fetch = true;
          callback(storage);
        }
      }
    );
  },
  loadFromFile: function (storage, callback) {
    OS.File.read(storage.file).then(
      function onSuccess(stream) {
        var decoder = new TextDecoder();
        storage.buffer = decoder.decode(stream);
        callback(storage);
      }
    );
  },
  saveToFile: function (file, stream) {
    OS.File.writeAtomic(file, stream, {encoding: "utf-8"}).then(
      function onSuccess() {
        var nsIFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        nsIFile.initWithPath(file);
        nsIFile.reveal();
      }
    );
  }
};

var Preferences = {
  prefs: Services.prefs.getBranch("extensions.simpleproxy."),
  option: [],
  observe: function (subject, topic, data) {
    if (topic == "nsPref:changed") {
      Preferences.option.forEach(function (element, index, array) {
        element();
      });
    }
  },
  getValue: function (branch) {
    if (branch.type == "boolean") {
      return Preferences.prefs.getBoolPref(branch.name);
    } else if (branch.type == "integer") {
      return Preferences.prefs.getIntPref(branch.name);
    } else if (branch.type == "string") {
      return Preferences.prefs.getComplexValue(branch.name, Ci.nsISupportsString).data;
    }
  },
  setValue: function (branch, value) {
    if (branch.type == "boolean") {
      Preferences.prefs.setBoolPref(branch.name, value);
    } else if (branch.type == "integer") {
      Preferences.prefs.setIntPref(branch.name, value);
    } else if (branch.type == "string") {
      var character = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
      character.data = value;
      Preferences.prefs.setComplexValue(branch.name, Ci.nsISupportsString, character);
    }
  },
  resetValue: function (branch) {
    Preferences.setValue(branch, branch.value);
  },
  on: function (data, branch) {
    Preferences.option.push(branch);
    Preferences.prefs.addObserver(data, Preferences, false);
  },
  off: function (data, branch) {
    Preferences.option = [];
    Preferences.prefs.removeObserver(data, Preferences);
  }
};

var Pattern = {
  encode: function (string) {
    if (string.startsWith("||")) {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$").replace("||", "^https?://([^\\/^\\.]+\\.)*");
    } else if (string.startsWith("|")) {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$").replace("|", "^");
    } else if (string.startsWith("/") && string.endsWith("/")) {
      var pattern = string.substring(1, string.length - 1);
    } else {
      var pattern = string.replace(/\./g, "\\.").replace(/\*/g, ".*").replace("^", "$");
    }
    return new RegExp(pattern);
  }
};

var Synchronize = {
  fetch: function (storage, callback, probe) {
    probe = probe || 0;
    if (probe > 3) return;
    probe ++;

    probe ++;
    var temp = storage.file + "_sp";
    Downloads.fetch(storage.list, temp, {isPrivate: true}).then(
      function onSuccess() {
        FileIO.moveFile(temp, storage.file);
        callback(storage);
      },
      function onFailure() {
        Synchronize.fetch(storage, callback, probe);
      }
    );
  }
};

var Core = {
  subscription: function (storage) {
    if (storage.fetch || storage.date + 4 * 86400000 < Date.now()) {
      Synchronize.fetch(storage, Core.listData);
    } else {
      Core.listData(storage);
    }
  },
  listData: function (storage) {
    FileIO.loadFromFile(storage, Core.listArray);
  },
  listArray: function (storage) {
    storage.white = [], storage.match = [];

    try {
      var list = window.atob(storage.buffer).split(/[\r\n]+/);
    }
    catch (e) {
      var list = storage.buffer.split(/[\r\n]+/);
    }

    list.forEach(function (element, index, array) {
      if (element.startsWith("!") || element.startsWith("[") || element == "") return;
      if (element.startsWith("@@")) {
        storage.white.push(Pattern.encode(element.substr(2)));
      }
      else {
        storage.match.push(Pattern.encode(element));
      }
    });
  }
};

var Events = {
  pendingOption: function () {
    try {
      Preferences.getValue( { name: "number", type: "integer" } );
    }
    catch (e) {
      Preferences.setValue( { name: "number", type: "integer" } , 1);
    }
    finally {
      var num = Preferences.getValue( { name: "number", type: "integer" } );
      if (num > 9) {
        num = 9;
        Preferences.setValue( { name: "number", type: "integer" } , 9);
      }
      else if (num < 1) {
        num = 1;
        Preferences.setValue( { name: "number", type: "integer" } , 1);
      }
    }

    for (var i = 0; i < num; i ++) {
      try {
        Preferences.getValue( { name: "list." + i, type: "string" } );
        Preferences.getValue( { name: "server." + i, type: "string" } );
      }
      catch (e) {
        Preferences.setValue( { name: "list." + i, type: "string" }, "");
        Preferences.setValue( { name: "server." + i, type: "string" }, "");
      }
      finally {
        Storage[i] = { list: Preferences.getValue( { name: "list." + i, type: "string" } ), server: Preferences.getValue( { name: "server." + i, type: "string" } ) };
        Events.pendingData(Storage[i]);
      }
    }

    Events.pendingAddon();
  },
  pendingData: function (storage) {
    Events.getServer(storage);
    Events.getPattern(storage);
  },
  pendingAddon: function () {
    FileIO.makeFolder(FileIO.folder);
  },
  getServer: function (storage) {
    if (storage.server.match(/^(http|socks|socks4)::(\w+\.)*\w+::\d{1,5}$/i)) {
      var array = storage.server.split("::");
      storage.host = array[1] + ":" + array[2];
      storage.proxy = Services.pps.newProxyInfo(array[0], array[1], array[2], 1, 0, null);
    }

    return;
  },
  getPattern: function (storage) {
    if (storage.list.match(/^https?:\/\/([^\/]+\/)+[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = FileIO.joinPath(FileIO.folder, FileIO.uriFileName(storage.list));
      FileIO.fileInfo(storage, Core.subscription);
    } else if (storage.list.match(/^\w:\\([^\\]+\\)*[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = storage.list;
      Core.listData(storage);
    } else if (storage.list.match(/^[^\\\?\/\*\|<>:"]+\.(txt|ini)$/i)) {
      storage.file = FileIO.joinPath(FileIO.folder, storage.list);
      Core.listData(storage);
    }

    return;
  },
  on: function () {
    Events.pendingOption();
    Preferences.on("", Events.pendingOption);
  },
  off: function () {
    Preferences.off("", Events.pendingOption);
  }
};

var Proxy = {
  applyFilter: function (service, uri, proxy) {
    for (var i in Storage) {
      if (Storage[i].proxy == undefined || Storage[i].file == undefined) continue;

      var white = Storage[i].white, match = Storage[i].match, server = Storage[i].proxy;

      if (white != undefined) {
        for (var x in white) {
          var rule = white[x];
          if (rule.test(uri.spec)) {
            return proxy;
          }
        }
      }

      if (match != undefined) {
        for (var y in match) {
          var _rule = match[y];
          if (_rule.test(uri.spec)) {
            return server;
          }
        }
      }
    }

    return proxy;
  },
  on: function () {
    Services.pps.registerFilter(Proxy, 3);
  },
  off: function () {
    Services.pps.unregisterFilter(Proxy);
  }
};

function startup() {
  Events.on();
  Proxy.on();
}

function shutdown() {
  Events.off();
  Proxy.off();
}
