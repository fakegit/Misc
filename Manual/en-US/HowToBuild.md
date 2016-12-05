#How to Build an Add-on

##Add-on Type
- Add-ons SDK based Add-ons contain package.json , and usually do not contain install.rdf or bootstrap.js
- Legacy Add-ons does not contain package.json , but do contain install.rdf , and bootstrap.js for restartless add-ons

##Build Guide
- 1) Install `npm` (aka nodejs)
- 2) Run Node.js command prompt
  - 2.1) Run `npm install jpm -global` to install jpm (currently 1.0.5)
- 3) Download and Extract the source code to X:\yyyyy\zzzzz
- 4) Enter `cd /d X:\yyyyy\zzzzz` to select the folder where you have extracted the source code
- 5) Run `jpm xpi` command to build your add-on
  - 5.1.1) Add-ons SDK based add-on will generate my-addon.xpi, and my-addon.update.rdf
  - 5.1.2) Legacy add-on will only generate null.xpi
  - 5.2) Upload my-addon.xpi(null.xpi) to AMO and get signed
- 6) Run `jpm sign` command to build and sign your add-on
  - 6.1) If it is an Add-ons SDK based add-on, you can skip Step 5)
  - 6.2) If it is a Legacy add-on, you must use `--xpi` argument to sign the null.xpi(or something else)
- 7) You may need the .jpmignore to skip files that is not needed when you build an add-on

#Something important

##Add-ons SDK based Add-ons
- 1) You must change the UUID of the add-on in package.json
- 2) You must edit or delete the updateURL, updateLink, and updateKey keys in package.json
  - 2.1) If updateKey is defined, you have to edit the version and updateLink keys in <a href="https://goo.gl/hHAx3m">Update.rdf</a> and sign it with McCoy

<p><img src="http://i66.tinypic.com/ml5abm.png"></p>

##Legacy Add-ons
- 1) You must change the UUID of the add-on in install.rdf
- 2) You must edit or delete the updateURL key in install.rdf
- 3) You must edit or delete the updateLink key in Update.rdf
- 4) updateKey key in install.rdf and signature key in update.rdf are signed by McCoy
  - 4.1) If you upload the .xpi files to a host over SSL, there's no need to use McCoy

<p><img src="http://i68.tinypic.com/29zzcpv.png"></p>
<p><img src="http://i67.tinypic.com/6944dl.png"></p>
