"use strict";

/*
version: 20170508-1408
require: 1.0.0
*/
exports.on = function () {
  acvaa = new AntiChinaVideoAds();
  acvaa.register();
}
exports.off = function () {
  acvaa.unregister();
  acvaa = null;
}

var {Cc, Ci, Cr, Cu} = require("chrome");
var {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});
var acvaa, host = "https://coding.net/u/HalfLife/p/swf/git/raw/gh-pages/";

function AntiChinaVideoAds() {};
AntiChinaVideoAds.prototype = {
        SITES: {
/*          'youkuloader': {
                'player': host + 'loader.swf',
                're': /https?:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/loaders?\.swf/i
            },
            'youkuplayer': {
                'player': host + 'player.swf',
                're': /https?:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/swf\/q?player[^\.]*\.swf/i
            },
*/
            'youku_loader': {
                'player': host + 'loader.swf',
                're': /https?:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/.*\/loaders?\.swf/i
            },
            'youku_player': {
                'player': host + 'player.swf',
                're': /https?:\/\/static\.youku\.com(\/v[\d\.]*)?\/v\/.*\/q?player.*\.swf/i
            },
            'ku6': {
                'player': host + 'ku6.swf',
                're': /https?:\/\/player\.ku6cdn\.com\/default\/.*\/(v|player)\.swf/i
            },
            'ku6_out': {
                'player': host + 'ku6_out.swf',
                're': /https?:\/\/player\.ku6cdn\.com\/default\/out\/\d{12}\/player\.swf/i
            },
            'iqiyi': {
                'player': host + 'iqiyi5.swf',
                're': /https?:\/\/www\.iqiyi\.com\/(player\/\d+\/Player|common\/flashplayer\/\d+\/(Main|Coop|Share|Enjoy)?(Player_[^\.]+|[^\/]+c2359))\.swf/i
            },
            'iqiy_out': {
                'player': host + 'iqiyi_out.swf',
                're': /https?:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/SharePlayer_.*\.swf/i
            },
            'tudou': {
                'player': host + 'tudou.swf',
                're': /https?:\/\/js\.tudouui\.com\/.*portalplayer[^\.]*\.swf/i
            },
            'tudou_olc': {
                'player': host + 'olc_8.swf',
                're': /https?:\/\/js\.tudouui\.com\/.*olc[^\.]*\.swf/i
            },
            'tudou_sp': {
                'player': host + 'sp.swf',
                're': /https?:\/\/js\.tudouui\.com\/.*\/socialplayer[^\.]*\.swf/i
            },
            'letv': {
                'player': host + 'letvsdk.swf',
                're': /https?:\/\/player\.letvcdn\.com\/.*\/newplayer\/LetvPlayerSDK\.swf/i
            },
            'letv_live': {
                'player': host + 'letv.in.Live.swf',
                're': /https?:\/\/.*letv.*\.com\/.*\/VLetvPlayer\.swf/i
            },
            'pptv': {
                'player': host + 'pptv.swf',
                're': /https?:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i
            },
            'pptv_live': {
                'player': host + 'pptv.in.Live.swf',
                're': /https?:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i
            },
            'sohu_live': {
                'player': host + 'sohu_live.swf',
                're': /https?:\/\/(tv\.sohu\.com\/upload\/swf\/(p2p\/)?\d+|(\d+\.){3}\d+\/wp8player)\/Main\.swf/i
            },
            'pps': {
                'player': host + 'iqiyi.swf',
                're': /https?:\/\/www\.iqiyi\.com\/common\/.*\/pps[\w]+.swf/i
            }
        },
        REFRULES: {
            'iqiyi': {
                're': 'http://www.iqiyi.com/',
                'find': /.*\.qiyi\.com/i
            },
            'youku': {
                're': 'http://www.youku.com/',
                'find': /http:\/\/.*\.youku\.com/i
            }
        },
        os: Cc['@mozilla.org/observer-service;1']
                .getService(Ci.nsIObserverService),
        init: function() {
            var site = this.SITES;
        },
        // getPlayer, get modified player
        getPlayer: function(site, callback) {
            NetUtil.asyncFetch(site['player'], function(inputStream, status) {
                var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1']
                                            .createInstance(Ci['nsIBinaryOutputStream']);
                var storageStream = Cc['@mozilla.org/storagestream;1']
                                        .createInstance(Ci['nsIStorageStream']);
                var count = inputStream.available();
                var data = NetUtil.readInputStreamToString(inputStream, count);

                storageStream.init(512, count, null);
                binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
                binaryOutputStream.writeBytes(data, count);

                site['storageStream'] = storageStream;
                site['count'] = count;

                if(typeof callback === 'function') {
                    callback();
                }
            });
        },
        getWindowForRequest: function(request){
            if(request instanceof Ci.nsIRequest){
                try{
                    if(request.notificationCallbacks){
                        return request.notificationCallbacks
                                    .getInterface(Ci.nsILoadContext)
                                    .associatedWindow;
                    }
                } catch(e) {}
                try{
                    if(request.loadGroup && request.loadGroup.notificationCallbacks){
                        return request.loadGroup.notificationCallbacks
                                    .getInterface(Ci.nsILoadContext)
                                    .associatedWindow;
                    }
                } catch(e) {}
            }
            return null;
        },
        observe: function(aSubject, aTopic, aData) {

			if (aTopic == "http-on-modify-request") {
				var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
				for(var i in this.REFRULES) {
					var rule = this.REFRULES[i];
					try {
						var URL = httpChannel.originalURI.spec;
						if(rule['find'].test(URL)) {
							httpChannel.referrer = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(rule['re'], null, null);
							httpChannel.setRequestHeader('Referer', rule['re'], false);
						}
					}
					catch(e) {}
				}
				return;
			}

            if(aTopic != 'http-on-examine-response') return;

            var http = aSubject.QueryInterface(Ci.nsIHttpChannel);

            for(var i in this.SITES) {
                var site = this.SITES[i];
                if(site['re'].test(http.URI.spec)) {
                    var fn = this, args = Array.prototype.slice.call(arguments);

                    if(typeof site['preHandle'] === 'function')
                        site['preHandle'].apply(fn, args);

                    if(!site['storageStream'] || !site['count']) {
                        http.suspend();
                        this.getPlayer(site, function() {
                            http.resume();
                            if(typeof site['callback'] === 'function')
                                site['callback'].apply(fn, args);
                        });
                    }

                    var newListener = new TrackingListener();
                    aSubject.QueryInterface(Ci.nsITraceableChannel);
                    newListener.originalListener = aSubject.setNewListener(newListener);
                    newListener.site = site;

                    break;
                }
            }
        },
        QueryInterface: function(aIID) {
            if(aIID.equals(Ci.nsISupports) || aIID.equals(Ci.nsIObserver))
                return this;

            return Cr.NS_ERROR_NO_INTERFACE;
        },
        register: function() {
            this.init();
            this.os.addObserver(this, 'http-on-examine-response', false);
            this.os.addObserver(this, 'http-on-modify-request', false);
        },
        unregister: function() {
            this.os.removeObserver(this, 'http-on-examine-response', false);
            this.os.removeObserver(this, 'http-on-modify-request', false);
        }
    };

    // TrackingListener, redirect youku player to modified player
    function TrackingListener() {
        this.originalListener = null;
        this.site = null;
    }
    TrackingListener.prototype = {
        onStartRequest: function(request, context) {
            this.originalListener.onStartRequest(request, context);
        },
        onStopRequest: function(request, context) {
            this.originalListener.onStopRequest(request, context, Cr.NS_OK);
        },
        onDataAvailable: function(request, context) {
            this.originalListener.onDataAvailable(request, context, this.site['storageStream'].newInputStream(0), 0, this.site['count']);
        }
    };
