## Caution

- Use at your own risk

## How To Build

- Read [Build an Add-on](https://github.com/jc3213/Misc/blob/master/Manual/en-US/HowToBuild.md)

## How to use

- 0) Simple Filter uses the new MatchPattern.jsm API
- 1) Simple Filter Rule contains `Prefix`, `Sub-Prefix`, `Match Pattern`, `Suffix`, `Option String`
<p><img src="http://i66.tinypic.com/ztgdcn.png"></p>
    - 1.1.0) User can use <a href="https://goo.gl/vt6Jj4">Simple Converter</a> to convert Adblock Plus Rulelist
    - 1.1.1) `Prefix` $ determine Blocking Rule, `Prefix` > determine Redirect Rule, `Prefix` < determine Modify Headers Rule, `Prefix` # determine Proxy Rule
    - 1.1.2) `Sub-Prefix` ! to determine if the rule is to be matched, `Sub-Prefix` ? to determine if the rule is whitelisted
    - 1.1.3) `Prefix` ## to define the Proxy Server you want to use (follow the format of Simple Proxy)
    - 1.1.4) Read about how to write [Match Patterns](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Match_patterns)
    - 1.1.5) `Suffix` # is only available for Blocking Rule, which is slower but more compatible
    - 1.1.6) `Suffix` ^ is only available for Redirect Rule, which means "redirect to"
    - 1.1.7) `Suffix` @ is only available for Modify Headers Rule
  - 1.2) You'd better have a look into [Simple Filter Sample List](https://raw.githubusercontent.com/jc3213/Misc/master/Sample/SimpleFilter.txt)
- 2) Use remote address http:// or https:// to subscribe proxy list, compatible with base64 encoding
  - 2.1) For example, [Simple Filter Sample List](https://raw.githubusercontent.com/jc3213/Misc/master/Sample/SimpleFilter.txt)
  - 2.2) Subscription(s) will be updated in 4 days
- 3) User can address absolute path using `Browse...` button in about:addons
- 4) User can address relative path using `file.txt` to access the rulelist in `Profile\SimpleFilter\file.txt`
- 5) User can modify rules by click `Edit: Rulelist **`
  - 5.1) User need to click `save` before `close` the editor if any modification has been done
