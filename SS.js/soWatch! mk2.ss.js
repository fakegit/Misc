"use strict";

/*
version: 20170411-1613
require: 1.0.2
*/
exports.on = startup;
exports.off = shutdown;

var {Cc, Ci, Cr, Cu} = require('chrome');
var Locales = require("sdk/l10n").get;
var {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});
var {OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
var {Downloads} = Cu.import("resource://gre/modules/Downloads.jsm", {});
var {CustomizableUI} = Cu.import("resource:///modules/CustomizableUI.jsm", {});

var Storage = {
  option: {},
  website: {},
  player: {},
  filter: {},
  file: {}
};

var Rulelist = {
  option: [
    ["report", null, "command", null, 0],
    ["restore", null, "command", null, 1],
    ["button", true, "boolean", true, null],
    ["update", 0, "integer", false, null],
    ["interval", 8, "integer", true, null],
    ["download", null, "command", null, 2],
    ["offline", true, "boolean", true, 2],
    ["server", "", "string", false, null],
    ["folder", "", "string", false, null]
  ],
  website: [
    [
      "youku",
      0,
      "youku.com",
      [
        ["player", 0, "loader.swf", /https?:\/\/static\.youku\.com\/[^\/]+\/v\/swf\/.*loader.*\.swf/i],
        ["player", 0, "player.swf", /https?:\/\/static\.youku\.com\/[^\/]+\/v\/swf\/.*player.*\.swf/i],
        ["filter", 1, /https?:\/\/val.+\.atm\.youku\.com\/v.+/i]
      ]
    ],
    [
      "tudou",
      0,
      "tudou.com",
      [
        ["player", 0, "tudou.swf", /https?:\/\/js\.tudouui\.com\/bin\/lingtong\/PortalPlayer.+\.swf/i],
        ["filter", 0, /https?:\/\/val.+\.atm\.youku\.com\/v.+/i]
      ]
    ],
    [
      "iqiyi",
      0,
      "iqiyi.com",
      [
        ["player", 0, "iqiyi5.swf", /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/[^\/]+\/(MainPlayer_.+|\w+c2359)\.swf/i],
        ["player", 0, "iqiyi_out.swf", /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/[^\/]+\/EnjoyPlayer.+\.swf/],
        ["filter", 0, /https?:\/\/([^\.\/]+\.){3}[^\.\/]+\/videos\/other\/([^\/]+\/){3}.+\.(f4v|hml)/i]
      ]
    ],
    [
      "letv",
      0,
      "le.com",
      [
        ["player", 0, "letv.swf", /https?:\/\/player\.letvcdn\.com\/([^\/]+\/){4,6}newplayer\/(SDK)?LetvPlayer\.swf/i],
        ["player", 1, "http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml", /https?:\/\/www\.le\.com\/cmsdata\/playerapi\/pccs_(PlayerSDK|LiveSDK|main).*\.xml/i],
        ["filter", 0, /https?:\/\/(\d+\.){3}(\d+\/){4}letv-gug\/[^\/]+\/ver_.+avc.+aac.+\.mp4/i]
      ]
    ],
    [
      "sohu",
      0,
      "sohu.com",
      [
        ["player", 0, "sohu_live.swf", /https?:\/\/tv\.sohu\.com\/upload\/swf\/[^\/]+\/Main\.swf/i],
        ["filter", 1, /https?:\/\/(\d+\.){3}\d+\/sohu\.vodnew\.lxdns\.com\/sohu\/([^\/]+\/){3}.+\.mp4.+&prod=ad/i],
        ["filter", 1, /https?:\/\/images\.sohu.com\/ytv\/BJ\/BJSC\/\d+\.swf/i],
        ["filter", 1, /https?:\/\/newflv\.sohu\.ccgslb\.net\/(\d+\/){2}.+\.mp4.+&prod=ad/i]
      ]
    ],
    [
      "pptv",
      0,
      "pptv.com",
      [
        ["player", 0, "player4player2.swf", /https?:\/\/player\.pplive\.cn\/ikan\/[^\/]+\/player4player2\.swf/i],
        ["filter", 0, /https?:\/\/de\.as\.pptv\.com\/ikandelivery\/vast\/.+draft\/.+/i]
      ]
    ]
  ],
  wrapper: [
    ["filter", "youku", ["tudou"]]
  ]
};

var Services = {
  io: Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService),
  obs: Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
  sss: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
  prefs: Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).QueryInterface(Ci.nsIPrefBranch)
};

var FileIO = {
  folder: OS.Path.join(OS.Constants.Path.profileDir, "soWatch"),
  server: "https://bitbucket.org/kafan15536900/haoutil/raw/master/player/testmod/",
  joinPath: function (base, addon) {
    return OS.Path.join(base, addon);
  },
  toURI: function (path) {
    return OS.Path.toFileURI(path);
  },
  makeFolder: function (path) {
    OS.File.makeDir(path);
  },
  moveFile: function (object, target) {
    OS.File.move(object, target);
  }
};

var Pattern = {
  makeRegExp: function (string) {
    var pattern = string.replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/\./g, "\\.").replace(/\*/g, ".*");
    return new RegExp(pattern, "i");
  },
  encode: function (data) {
    if (typeof data == "string") {
      return Pattern.makeRegExp(data);
    }
    else {
      return data;
    }	
  }	
};

var Preferences = {
  prefs: Services.prefs.getBranch("extensions.sowatchmk2."),
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
    }
    else if (branch.type == "integer") {
      return Preferences.prefs.getIntPref(branch.name);
    }
    else if (branch.type == "string") {
      return Preferences.prefs.getComplexValue(branch.name, Ci.nsISupportsString).data;
    }
  },
  setValue: function (branch, value) {
    if (branch.type == "boolean") {
      Preferences.prefs.setBoolPref(branch.name, value);
    }
    else if (branch.type == "integer") {
      Preferences.prefs.setIntPref(branch.name, value);
    }
    else if (branch.type == "string") {
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

var Synchronize = {
  fetch: function (link, file, probe) {
    probe = probe || 0;
    if (probe > 3) return;
    probe ++;

    var temp = file + "_sotemp";
    Downloads.fetch(link, temp, {isPrivate: true}).then(
      function onSuccess() {
        FileIO.moveFile(temp, file);
      },
      function onFailure() {
        FileIO.makeFolder(FileIO.folder);
        fetch(link, file, probe);
      }
    );
  }
};

var Core = {
  optionStorage: function () {
    Storage.option.config = {}, Storage.option.command = [], Storage.option.menuitem = [];

    Rulelist.option.forEach(function (element, index, array) {
      var name = element[0], value = element[1], type = element[2], reset = element[3], order = element[4];
      if (type != "command") {
        Storage.option.config[name] = {
          prefs: {name: name, type: type, value: value},
          reset: reset
        };
      }

      if (typeof order == "number") {
        if (type == "command" || type == "boolean") {
          Storage.option.command.push([name, type]);
          if (!Storage.option.menuitem[order]) {
            Storage.option.menuitem[order] = [];
          }
          Storage.option.menuitem[order].push([name, type]);
        }
      }
    });

    Rulelist.website.forEach(function (element, index, array) {
      var name = element[0], value = element[1], host = element[2], option = element[3];
      Storage.website[name] = {
        prefs: {name: name, type: "integer", value: value},
        host: host,
        option: option
      };
    });
  },
  optionWrapper: function () {
    Rulelist.wrapper.forEach(function (element, index, array) {
      var entry = element[0], major = element[1], minor = element[2];
      minor.forEach(function (element, index, array) {
        major = Storage.website[major], minor = Storage.website[element];
        if (entry == "player") {
          if ((major.value == 1 && minor.value != 1) || (major.value != 0 && minor.value == 1)) {
            Preferences.setValue(minor.prefs, major.value);
          }
        }
        if (entry == "filter") {
          if ((major.value == 2 && minor.value == 0) || (major.value == 0 && minor.value == 2)) {
            Preferences.setValue(minor.prefs, major.value);
          }
        }
      });
    });
  }
};

var Events = {
  pendingRules: function (option, name, prefix) {
    var queue = [], test = {};

    option.forEach(function (element, index, array) {
      var type = element[0], param = prefix + index;

      if (type == "player") {
        var mode = element[1], player = element[2], string = element[3];

        if (mode == 1) {
          var offline, online = offline = player;
        }
        else {
          var path = FileIO.joinPath(Storage.file.folder, player), offline = FileIO.toURI(path), online = Storage.file.server + player;
          queue.push([online, path]);
        }

        Storage.player[param] = {
          website: name,
          offline: offline,
          online: online,
          pattern: Pattern.encode(string)
        };
      }
      else if (type == "filter") {
        var mode = element[1], string = element[2];

        Storage.filter[param] = {
          website: name,
          mode: mode,
          pattern: Pattern.encode(string)
        };
      }
    });

    queue.forEach(function (element, index, array) {
      if(!test[element]) {
        test[element] = 1;
        Storage.file.queue.push(element);
      }
    });
  },
  pendingSites: function () {
    Object.keys(Storage.website).forEach(function (element, index, array) {
      var website = Storage.website[element], param = index * 100;

      try {
        Preferences.getValue(website.prefs);
      }
      catch (e) {
        Preferences.resetValue(website.prefs);
      }
      finally {
        website.value = Preferences.getValue(website.prefs);
      }

      Events.pendingRules(website.option, element, param);
    });

    for (var i in Storage.player) {
      var param = Storage.player[i].website, website;
      if (website = Storage.website[param]) {
        website.hasPlayer = true;
        if (website.value == 1) {
          Storage.player[i].enabled = true;
        }
        else {
          Storage.player[i].enabled = false;
        }
      }
    }

    for (var x in Storage.filter) {
      var param = Storage.filter[x].website, website;
      if (website = Storage.website[param]) {
        website.hasFilter = true;
        if (website.value == 2) {
          Storage.filter[x].enabled = true;
        }
        else {
          Storage.filter[x].enabled = false;
        }
      }
    }

    Core.optionWrapper();
  },
  pendingOption: function () {
    for (var i in Storage.option.config) {
      try {
        Preferences.getValue(Storage.option.config[i].prefs);
      }
      catch (e) {
        Preferences.resetValue(Storage.option.config[i].prefs);
      }
      finally {
        Storage.option.config[i].value = Preferences.getValue(Storage.option.config[i].prefs);
      }
    }

    Storage.file.folder = Storage.option.config["folder"].value || FileIO.folder;
    Storage.file.server = Storage.option.config["server"].value || FileIO.server;
    Storage.file.queue = [];

    Events.pendingSites();
    Events.pendingAddOn();
  },
  pendingAddOn: function () {
    FileIO.makeFolder(Storage.file.folder);

    if (Storage.option.config["button"].value) {
      Toolbar.on();
    }
    else {
      Toolbar.off();
    }

    if (Storage.option.config["update"].value < Date.now() / 1000) {
      Worker.download();
    }
  },
  on: function () {
    Core.optionStorage();
    Events.pendingOption();
    Preferences.on("", Events.pendingOption);
  },
  off: function () {
    Preferences.off("", Events.pendingOption);
  }
};

var HttpRequest = {
  request: {
    counter: {}
  },
  setFilter: function (rule, httpChannel) {
    if (rule["mode"] == 1) {
      httpChannel.suspend();
    }
    else {
      httpChannel.cancel(Cr.NS_BINDING_ABORTED);
    }
  },
  setPlayer: function (object, rule, httpChannel) {
    httpChannel.suspend();
    NetUtil.asyncFetch(object, function (inputStream, status) {
      var binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
      var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
      var count = inputStream.available();
      var data = NetUtil.readInputStreamToString(inputStream, count);
      storageStream.init(512, count, null);
      binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
      binaryOutputStream.writeBytes(data, count);
      rule["storageStream"] = storageStream;
      rule["count"] = count;
      httpChannel.resume();
    });
  },
  observe: function (subject, topic, data) {
    if (topic == "http-on-examine-response") {
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      HttpRequest.getFilter(httpChannel);
      HttpRequest.getPlayer(subject, httpChannel);
    }
  },
  getFilter: function (httpChannel) {
    for (var i in Storage.filter) {
      var rule = Storage.filter[i];

      if (!rule.enabled) continue;

      if (rule.pattern.test(httpChannel.URI.spec)) {
        if (rule.website == "iqiyi") {
          HttpRequest.request.counter[rule.website] ++;
          if (HttpRequest.request.counter[rule.website] != 2) {
            HttpRequest.setFilter(rule, httpChannel);
          }
        }
        else {
          HttpRequest.setFilter(rule, httpChannel);
        }
      }
    }
  },
  getPlayer: function (subject, httpChannel) {
    var offline = Storage.option.config["offline"].value;

    for (var i in Storage.player) {
      var rule = Storage.player[i], site = Storage.website[rule.website];

      if (httpChannel.URI.host.indexOf(site.host) > -1) {
        if (rule.website == "iqiyi") {
          HttpRequest.request.counter[rule.website] = 0;
        }
        site.visit = true;
      }
      else {
        site.visit = false;
      }

      if (!rule.enabled) continue;

      if (rule.pattern.test(httpChannel.URI.spec)) {
        if (!rule["storageStream"] || !rule["count"]) {
          if (offline) {
            HttpRequest.setPlayer(rule.offline, rule, httpChannel);
          }
          else {
            HttpRequest.setPlayer(rule.online, rule, httpChannel);
          }
        }
        var newListener = new TrackingListener();
        subject.QueryInterface(Ci.nsITraceableChannel);
        newListener.originalListener = subject.setNewListener(newListener);
        newListener.rule = rule;
        break;
      }
    }
  },
  on: function () {
    Services.obs.addObserver(HttpRequest, "http-on-examine-response", false);
  },
  off: function () {
    Services.obs.removeObserver(HttpRequest, "http-on-examine-response");
  }
};

function TrackingListener() {
  this.originalListener = null;
  this.rule = null;
}
TrackingListener.prototype = {
  onStartRequest: function (request, context) {
    this.originalListener.onStartRequest(request, context);
  },
  onStopRequest: function (request, context) {
    this.originalListener.onStopRequest(request, context, Cr.NS_OK);
  },
  onDataAvailable: function (request, context) {
    this.originalListener.onDataAvailable(request, context, this.rule["storageStream"].newInputStream(0), 0, this.rule["count"]);
  }
}

var Worker = {
  restore: function () {
    for (var i in Storage.option.config) {
      if (Storage.option.config[i].reset) {
        Preferences.resetValue(Storage.option.config[i].prefs);
      }
    }

    for (var x in Storage.website) {
      Preferences.resetValue(Storage.website[x].prefs);
    }
  },
  download: function () {
    Preferences.setValue(Storage.option.config["update"].prefs, parseInt(Date.now() / 1000) + Storage.option.config["interval"].value * 86400);

    Storage.file.queue.forEach(function (element, index, array) {
      var link = element[0], file = element[1];
      Synchronize.fetch(link, file);
    });
  },
  report: function () {
    var self = require("sdk/self");
    var tabs = require("sdk/tabs");
    var issue = "https://github.com/jc3213/Misc/issues/new?title=soWatch! mk2(ss)" + "+" + tabs.activeTab.url;
    tabs.open(issue);
  }
};

var Toolbar = {
  icon: false,
  css: Services.io.newURI("data:text/css," + encodeURIComponent(""
+"@-moz-document url('chrome://browser/content/browser.xul') {"
+"#sowatchmk2-button { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wMRCzYEAp30/QAAAnBJREFUOMutk0tIlFEUgL9z/1+ZRmUca3IMgp4kPaCCJEOUIMqFLQqLpEUPa1O06UELS3s4QRuhQBAkIYWgLCs35bgwRSKyxsyitBeRUGpmTmZjzv/fFvNPKFIQdHfn3Hs+7nc4B/7n0WcyZutTGfn/UiOTg8o8c8/u7LQad6KKJVLSmzn65BZaPxClQn8F6FJ/NkIbGtPJABZExyEQBngJrBOR4ckA0yleAtxH/8bxlMW8mluEZaawHRhoupg5+3X9W308OUvOj76a8oOOXZ7XC32JC71uA4ARbyZVy1rIngdpSVDTqqkoEgbLV+Ob+Ai2nS7lAwMACqCr70e9N9kEO2bkGQox9OgeJ65rDtZqHr+H4DMbb26xo2ZUTlEozkl7gwVowdJCM/m0WXkkJcYe2VaUkW8WpuG0zJbCOEA5ykudC5Q1Rv7Zq6TKF6KRUazx74yFv7IxywXdNx3rGEiX+cXpOKMIYIMkuODafhpKqrl0N0JkQrNzvQ9PZy30hUC7AK31Sf9XOf0pNQ7ofPd5nPleN0QNeNqIu/8Fh9buBdMFDY3Q0wTijvVJEERvmjIHNza7de6CZGbNSHDkNIgNaDQG3fZKJnQiq1QHAXXmQlAXhIAuFQd8GP65oi/8sy4eh8XDsDWTCctFvzUHQywGTd/lWrVneVAXeNoD6bXAYZm2DyUZDxFjzbHBfeR7ewmqLWyzr1CtDrBI9ZTf1oXPxbbvoFQREFTTZjvwMQvDPjdip/RW1TXMGpKZNSvNjiMjktrbqjesEC09KKOiPeCvag/438qftiynpD+grUipGK4y4BTQApwAtgI7gG6g8Rdl5+twfoFY8gAAAABJRU5ErkJggg=='); }"
+"#sowatchmk2-button[cui-areatype='menu-panel'], toolbarpaletteitem[place='palette'] > #sowatchmk2-button { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wMRCzUu8gtu6AAABkpJREFUWMPtl2twXGUZx3/POWcvZNsQSDZJU5hpsAKVS3AYO53MVoJ2QieM1BlbR5l6owoq2DCOFyQmpQmhVrE6CMOMo4NaHILSUmc6CJMWwS6lI5cS6QVoLdiWkM2tuWyy2T173scPZ5Nsmm0iow5ffD+d817O838u///zHvj/+ICHzLXoNlU0OrZcCwyi5vfS1vsSgGkuv1iNGbXb+4f+pwAeui6ga2qKWVwSyM1oAqQi9zIurT2R/xSANdfiVYvCHZFg/pYp46CmSHfeMapDJ/tV9YiqeURV6/8rEUjebluR0mgn8Ik5T6uBzDgsWQG3PgVWAKAPWCsif33fALS5QlC9EMs6ARTPfVRBjP84kYS2AQicl7+hVUQ2zQfAyX/JZkzICdnvAAvODdlwIl3K4bFiet0gBqGqPMqNk8aTCXj0Zohe1qLP3CNywz0t/zYAJ2Q/P5fxrFo8MbCUxbG1XFDdgAl+GFegODDOWBoiIRhzhRd6zqe+ZwcYmrWl8oZ0sq82vM3z5ixC3Vz5OSxZfm7PlT16LfWbdnKgpJGusaWUROCiYuibKKJph3K0GyIXlLP8mw9yNFkMYgEsDy2IHpqXBU91jW7Z1tnHnqPJwqVplNUN9Tx8IMqTLyvVUWFJKVQUw0cWQ88I3L1D6RuBkvIq7LpvA1NOX67NFffPWYQPrHR+rkjjt+pKEQGMBZY5q+5cvrpgP29zKa6nREIQtGFwDIIOqEJDjfCd1TA2kSG4qZxAOFcbKniZdLGzdXC0YAQ27sve2XDFgofE8jdjCsF12Db+aQwQsCGThWTaNw4glvDcoXEAIuEgdvSS6bOehR0ONs4pREvLQ5eiOQB6dh4Me6SBG62XsdDCCfU8ksl03sezM1iLkc/Op4Qrpzbn2ejPnsevBq6mq+pmzMQoagqERwQ3NcziUnt6buCdmQCUq+YDEJ7ptB+F88PCLQ92cvstq8gYGzc5gHHTIAIiqPFwk2fwXJf6a3I5P7YH7OBs+bqpSArT8Ifl5bND6i8HUoNYp18h7EDjTSVkPMimRsgMJ8gM9+KODqDZDIuiRXxpZa5xPftjsHPPZtpPrYlUFwSQHZ4YyOd8Xt4gEIY/fh2A9bUOTevKsIJhMp5NxhNSXpCVV5fweONC/1zX43DqlTwFk0nOqYj9D22p7CvcC1oqpzOfyctl0PM5dkktfHnn1PSJPp8J1VEITWrq8b3wyDpwQtNR9HJmAsZ3Sszd0pbYUgjAa0DNQDJLaSjsG53cFfD8kERKYc1P4bLVM9M1fBo674VXO6abkhHInlVmQe89ae2pKtgLgGeBmu1/G+LOugqmWKSAa/sgxgZh+3ofVFWN72n/cRjpgWBk2ni+55MjYDDGrJiDBfqH471pVOHdocys7kvG9j2ygn7v7zkCpw/CxKhvHMh4IX7r3sqvzTdmHncMWbU+dp2+firWlJBYU0JmAZDWxIHhlHnXsYSjvalz9AQB1/LBuDlAru2/Z2zwhAAuQXKCZClDgYXj9br/pev11Y5clF8HXozd1R2cdSU71jOxHNh75L00RkxhwctpoacWxligYBC8nD8BSROw0hD0MjjeTz5lnr9ygqIa0DXx9orrUV0LXIFtf2gWgM8/k+7euM9d1bjPFbXM5hlRsJS0E+CXcgcJKumQL/ICH8fF4UViPCpf4RA12OKxi3Xt0toTinldW4ENwJkpfosUASlgTOa7Mmnzoj5cq8yvYGX3oTG2LnuLjbqVi81Jfmb9gDrtpEYPMi4R7pPNfIbH6Leif+rU1V8DaRL4DenMmwSDDiLXgG4AdsXbK3c5894aNVuD45wmawkIb/f73e7KM4+xrAw+6T2NhVJLnIwG6JAvcFKXECJdJ8gW4Hvx9srBWFPP5cBtwJkkqQ2vtVd7817LAeTevm7IXkTAvIUqZQt9gXn6732tT1SvD78py/6cssOHccwpY4uxJYtteSmbbD9INSorYk2JKpC/gOyOt1e0Thqf98dkFgGayz+6v7c0dlfZcw/E2ysk1pSwgTZgJN5e8aNYUyICxIE3gDiquxF5EuUXCA8Dq4DDOf0xwJD1fgBYbb0Hv3/h3g7gWO1335jU6hQwkqcWA6imgIn4fZX/RPU2hGagG9gEbAd+B9wPLPrAf07/BfjGil3v4mvFAAAAAElFTkSuQmCC'); }"
+"#sowatchmk2-report { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABeUlEQVR42o1Su0rEQBSdRLIs4mQyj6A2itYKFqKiIPsBgj/gD9iLvYW1nS+sZHvxE7bQb1ARwcpCVlQw6+JCPDdMZBLZbAYuzNx7zrmvYax0oija1FqfwO6NUp9kdCcfxVjFGTNSXk7GcVplhCHsPzIy3I4i50bYgghU2xRQUnbCMFyB64Bz/ojy7zLTugffXhAEq4SxlbQzMghrubJS6tRqTsDGnQrp7dGFMDmeuMztWwixzEYcDLJVmIcx5il7aN2HwFwNgVm09Z1xwGXUn308s5qHsDZpjwQSK/COmF+D74PzYQUSRp/EWc/2KLaUcsvBP7DYmAtY6nneQArxIznfGEZWnK8j64uztXMaypLgIkW8D5Gu7/spLMlWZE+z2WzB91r+UKhmMR/KWeZoNBZA3ME2OrD5XIDWi0TFL23MUbE8/DCU9wbVGYCjUvUcsS9n/1fD1nMM4ADWxXPaCU39DU7Kw8opA7CP6d6gFeW0IJH1Gv7dMv4XD3CMQnFQsK4AAAAASUVORK5CYII='); }"
+"#sowatchmk2-youku { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABNUlEQVR42mNgQAcB8xMYAhbs50pZ9583ezMYg9ggMbAcThAwXwGo6LxU2/H/uuse/zfe/RYFg8RAciA1YLXompnDl77XXH4fpuG9ye63/Ua73iSAMIgNEgPJgdSA1KIaAjQVSfN8g/3vBdAdCBIDycEMAbsE5meQ02CaQULTGRgUQBibT2GGQLwDChNg4ED9/B5m8wZt9f33SrP+7zTV3w80yAGLS96D9IADFhTCIBNB/oQp2qmhsP9/ZcJ/EH4a7vx/p7IkikHQMIHEDiiaQBxQYMENkOTf/99f7z8yfmop/38lL+d+kDxILUgPSC92A3gZ9v/XYPiPjJ/KMfxfy8nQj2EAVi8gGQDSeECAYT5yoKJ4AWsgcjLsvyeDqRFrIOKKRlwJFjMaKU5IVEnKFGcmCrIzAImRh14iWVqdAAAAAElFTkSuQmCC'); }"
+"#sowatchmk2-tudou { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVR42o1TTUtCURC9tGsVQeoiEoIW4apdtGphUf2DIOpaUGHlCwvN6g+YunZh0kMqf0GrIF7LFoH9hFxGppC59J3uzDWfX6kHBi7nzsydOTNXiBbgwjeHQ7cJY7KCvVEb28LGzogNw20jOFFQvER8aUz8h/qRx8KWAALKUmtA/lwbnYlTd+TTO3hdWOyUDQC1CrpAHN0pH/JtK7se8ujgZxMDQT6UJNSoBAcuk8u+lhgaWcntILGwKFgwep1KLL0DubC2r6IT0MmTL1VxOW8JVju1qh2PZ4HYDBCdBk59TgLiiaO7kwZPMREvBI8qH3OE+kO15Jx/yu1iEihmV6gENOf7M02a+0B6A3h7GKxDM4HhsZFY1mRSzTs4DrzcDk6QXGm0EHQVWMTqJ/CUAx7TQPG1f3Ct3CJi2Ct5JJnN4cdIvs0xqt3mRZKKsG6GWyTZskhtq0xJMkrE74/uQOLoTnascs/PRImu/MBdFDyhuF9z/T5T82+ovkgcRKZ4TGzqzBz13IFfP++/RCt0n9QAAAAASUVORK5CYII='); }"
+"#sowatchmk2-iqiyi { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR42mNgoBRUzDdQqJqt01A1R2d90yLL/yAMZGPFSPLrQXpAehmAnPfoCkC4YqbOFmSMLAdTXzlHZz8DlPOeVJfDLGagPAxmAp0yQ7cISM8GsZHwFqj4/8pZuvYwGpkNopEN2AIWgBqKzQCkMEEYADaVCAPKZ+quRnLdbtJdMEs7GG4AkI3TACAwxmYAksFgS2hnwOS1Yf9JMgAdnLyxOhQWUMSmKMpSIsV5gdLcCACkBG62JeRDmwAAAABJRU5ErkJggg=='); }"
+"#sowatchmk2-letv { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAw0lEQVR42mNgGPrgsrLWeyD+D8X3sam5oqplcFlFq+GSsuZ+oJr5l5S1EpAN+I+M0TVfUtHuR1cDwiDDzisYCOA14LKSZgGS3HqQS0CaQK6AGYLfAKCXwAqVtM6D+OcVNBSgLroPV4/LAJBiJPH3IEPQ1N4HhwUuAy6r6Dhg8TsowOeDvEJUIKIEGtDp6AGMNRBBgQWKMjAGsZG9gRR9IFdgDUS0qApASydo8pAwWA8yCRsGBSRytME1ggIUGEYMwwMAANSy8uCpJ/55AAAAAElFTkSuQmCC'); }"
+"#sowatchmk2-sohu { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACjElEQVR42mNgQAP/nz2T/zxrQvO74tRtbwsT9r9K9r3+pijq1OdFE9t/PH6swoAL/P//n/nL/FlFn2dMqvt5/74GstzPmzf1P83q6nsZYfn585zOySC1GJqfdHQ0z2lpqcvPyZ1cXVnZfvDgQSt0S34+vK39KtP/+rvqxEMohuxtaGqWFxB8x8rA+B+EHWxsDj158kTm15ETFti8+CLa/hXIJWCBV3fuqIixsP6CaVZRULz37t07/v+vXkk8ZRD6/8rC7fiP69fVkA35snV1yssAg/8/793UZ6irqWmGaQbhNSvXBINtundPHmTAUzaJ/88VDb5/6Z9RBHM2kGZ/4W/6+fOs9skMFiamp2CaBXh4P8MVwQwAYQ7J/88ltf6/NHM59fPcZX2Q/PvanHWvsoMuM4CcjOx8uF+RDUDGPLKfQfIf+tv6nnvq/wIbIMXABDZAQkT0FV4DgJq/zlqUDHZBRf7yF07a/xliTSxO1TBw/Q9lYP+vzcDy/8yZM0bYDHjtHroNJAaL9hfOVo9fRXleZ9hdXNl9j0Hw/0oG3v/XgfQa94BtyAY8E1B492Xu0jjkWPg8d272cw3F/x9aq2cz/ABG41MW0V/Itn3Ir+oD2fKpvb/8PzA9IGv+vmuf8zN5lc8gA35dOGMOFnyfUzb5KaPw/6csYnBDQPH/bfnacJAB/59+Evl28JjV24Ts+U/ZxX49E5P6/76kYDFyUmZ/beN56BmvHNDJiv/BhmGLAXCUiv5/7RtwCJjQeNDzA/v73IrJL6R1/r8ydfn/Qsno/zNu2f9PWYGuYhKBaGYU+v82LX8+hmaUDANMKB/yqma/8Qi5/lxK+z/IVS80La+/S8mb/es41M9IAAC3O6bCEKh1JAAAAABJRU5ErkJggg=='); }"
+"#sowatchmk2-pptv { list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADOklEQVR42pWTW0ybdRjGvyzZlnFBwjyQzCjdygoKxuPkRp1mV3qxaOKykBg1TkTjYbIZrR2zMEJbVlgccToUMsFOMZsmBrMwWCfl0COsllXaFejHaeVQytZ+rMBa+PlREuKiXvgk79X7/J7/mzfvXxD+Q8ft4oyu2y/pu/1xueZrXEGx9LrrQJZp0rXRMGoVtGKb8ELt5n+ABttgpMYxvMLfZJdrhxn09nEqO7w3182Ks1/cAVd2+WPLsjkqlxSVuJ6IsMdzm82V3VTX/8LszflUoLHHt7hGfPnsOqy3DkaG5Wbf5G0iYZGWhTm2tS+hPPgNXzX8yOWRKB1jcWxjElOyT2fxxu543egcWbkQXCQ0eYUTMYm08zcoKDbS1uFkLjrPzOgQv3onOGGdxuSe5es/Z5CxtBRcZRucbg7D8IQVbTiGYJqj4C0Drd9/S9JcS9hrxTogMtrv4pO2QUpaRIzOW+i7BqS1jdt8knPcRe30HEKzRO6rFbSc0kHkd+gvh+cE/D8Y6PvDi8nSy/OnvbxiEqmw+BKpAG3TB9JPoQBC4wL3vm6k8Vwryd8OwUAV1OWDdgMJXQ5iOI7TF0Cpd/JklVsOuLYswBOPG869uyw0gfBRC/uK1YzMREnW7oXX5Hb1Vmh7g1vth5malXAEJ9n2eRd5FQ7KO31J2ZFd/XTtGQR9iIxdB3ixzsaYx47lip/Ft9PldW8h2VrE2HgIlmJozCL3qc3k6nppCEqrEzzjEUohc6+G/PebeEjnosZ8lRGPDfdQiNHwAtNzCynYMXGDNI2F7epL5B/9mZO9w27B6DklCrutqPZreFRv57EyC1nlPRQ293PW0ocrMI5NnObj9iCb1B1kfdrOjnInx3qGVlILvLv0aiBtVwN5x9rIPViPqqyLB49cYrtszCzt5K5SC+nqy2wtucgDhy/K4Q7y1GdWbyB97YJ2tw4r9pnIMTpQrMKH6nlY3YjK4EF5tAeFphOFHJRVZifnyHlUxbql9QNKKeO7z+5/6TSK426UJwNkFBRahT0fvqd8uejazje18Z3vVCWyiyqXlIUlU1vuydz/r193w6Zsdb7xQkKlqYsLGx95Svgf+guf1kiQa4kxUAAAAABJRU5ErkJggg=='); }"
+"}"),
    null,
    null
  ),
  createCustomButton: function (document) {
    var button = document.createElement("toolbarbutton");
    button.setAttribute("id", "sowatchmk2-button");
    button.setAttribute("class", "toolbarbutton-1");
    button.setAttribute("type", "menu");
    button.setAttribute("label", "soWatch! mk2");

    var popup = document.createElement("menupopup");
    popup.setAttribute("id", "sowatchmk2-popup");
    popup.addEventListener("click", Toolbar.menuClick, false);
    popup.addEventListener("popupshowing", Toolbar.menuPopup, false);
    button.appendChild(popup);

    Toolbar.createPopupMenu(document, popup);

    return button;
  },
  createPopupMenu: function (document, popup) {
    var length = Storage.option.menuitem.length - 1;

    Storage.option.menuitem.forEach(function (element, index, array) {
      Toolbar.createTopItem(document, popup, element);

      if (index < length) {
        var separator = document.createElement("menuseparator");
        separator.setAttribute("id", "sowatchmk2-separator-" + index);
        popup.appendChild(separator);
      }
    });

    for (var i in Storage.website) {
      var separator = document.createElement("menuseparator");
      separator.setAttribute("id", "sowatchmk2-separator-" + i);
      popup.appendChild(separator);

      var menu = document.createElement("menu")
      menu.setAttribute("id", "sowatchmk2-" + i);
      menu.setAttribute("label", Locales("sowatchmk2-" + i));
      menu.setAttribute("class", "menu-iconic");
      popup.appendChild(menu);

      Toolbar.createSubItem(document, menu, [i, ["player", "filter", "none"]]);
    }
  },
  createTopItem: function (document, popup, param) {
    param.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      var item = document.createElement("menuitem");
      item.setAttribute("id", "sowatchmk2-" + name);
      item.setAttribute("class", "menuitem-iconic");
      item.setAttribute("label", Locales("sowatchmk2-" + name));
      if (type == "boolean") {
        item.setAttribute("type", "checkbox");
      }
      popup.appendChild(item);
    });
  },
  createSubItem: function (document, menu, param) {
    var popup = document.createElement("menupopup");
    var name = param[0], item = param[1], player = Storage.website[name].hasPlayer, filter = Storage.website[name].hasFilter;
    popup.setAttribute("id", "sowatchmk2-" + name + "-popup");
    menu.appendChild(popup);

    item.forEach(function (element, index, array) {
      var item = document.createElement("menuitem");
      item.setAttribute("id", "sowatchmk2-" + name + "-" + element);
      item.setAttribute("label", Locales("sowatchmk2-" + element));
      item.setAttribute("type", "radio");
      if (!player && element == "player") {
        item.setAttribute("disabled", "true");
      }
      if (!filter && element == "filter") {
        item.setAttribute("disabled", "true");
      }
      popup.appendChild(item);
    });
  },
  menuClick: function (event) {
    Storage.option.command.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      if (event.target.id == "sowatchmk2-" + name) {
        if (type == "command") {
          Worker[name]();
        }
        else if (type == "boolean") {
          if (Storage.option.config[name].value) {
            Preferences.setValue(Storage.option.config[name].prefs, false);
          }
          else {
            Preferences.setValue(Storage.option.config[name].prefs, true);
          }
        }
      }
    });

    for (var i in Storage.website) {
      var website = Storage.website[i];
      if (event.target.id == "sowatchmk2-" + i + "-player") {
        if (!website.hasPlayer) continue;
        Preferences.setValue(website.prefs, 1);
      }
      else if (event.target.id == "sowatchmk2-" + i + "-filter") {
        if (!website.hasFilter) continue;
        Preferences.setValue(website.prefs, 2);
      }
      else if (event.target.id == "sowatchmk2-" + i + "-none") {
        Preferences.setValue(website.prefs, 0);
      }
    }
  },
  menuPopup: function (event) {
    if (event.target.id == "sowatchmk2-popup") {
      Storage.option.command.forEach(function (element, index, array) {
        var name = element[0], type = element[1];
        if (type == "boolean") {
          if (Storage.option.config[name].value) {
            event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "true");
          }
          else {
            event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "false");
          }
        }
      });

      for (var i in Storage.website) {
        var website = Storage.website[i];
        if (website.value == 1) {
          event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("checked", "true");
        }
        else if (website.value == 2) {
          event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("checked", "true");
        }
        else if (website.value == 0) {
          event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("checked", "true");
        }
      }
    }
  },
  on: function () {
    if (Toolbar.icon) return;
    CustomizableUI.createWidget({
      id: "sowatchmk2-button",
      type: "custom",
      defaultArea: CustomizableUI.AREA_NAVBAR,
      onBuild: Toolbar.createCustomButton
    });
    Services.sss.loadAndRegisterSheet(Toolbar.css, Services.sss.AUTHOR_SHEET);
    Toolbar.icon = true;
  },
  off: function () {
    if (!Toolbar.icon) return;
    Services.sss.unregisterSheet(Toolbar.css, Services.sss.AUTHOR_SHEET);
    CustomizableUI.destroyWidget("sowatchmk2-button");
    Toolbar.icon = false;
  }
};

function startup(data, reason) {
  Events.on();
  Toolbar.on();
  HttpRequest.on();
}

function shutdown(data, reason) {
  Events.off();
  Toolbar.off();
  HttpRequest.off();
}
