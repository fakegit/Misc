# How to Build an Add-on

## Preparation
Install [npm](https://nodejs.org/download/release/latest/), `.msi` install package is recommended

## Build Guide
- 1) Run Node.js command prompt
  - 1) Run `npm install jpm -global` to install jpm (currently 1.0.5)
  - 2) Download and Extract the source code to X:\yyyyy\zzzzz
  - 3) Enter `cd /d X:\yyyyy\zzzzz` to select the folder where you have extracted the source code
  - 4) Run `jpm xpi` command to build `.xpi`
    - 1) Add-ons SDK add-ons will generate my-addon.xpi, and my-addon.update.rdf
    - 2) Legacy add-ons will only generate null.xpi
  - 5) Upload `.xpi` to AMO and get signed
  - 6) Run `jpm sign` command to build and sign your add-on
    - 1) Use `--xpi` argument to sign `.xpi` you would like to
    - 2) Add-ons SDK add-ons could skip `jpm xpi`
  - 7) You may need the .jpmignore to skip files that is not needed when you build an add-on
- 2) Run `make.cmd` to build the add-on
  - 1) If `jpm` is not installed, it will automatically install `jpm`
  - 2) Some repositories don't have `make.cmd`
