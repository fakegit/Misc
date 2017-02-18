##Option

Pattern `[ name, value, type, ignore, group ]`</br>
Sample `[ "restore", null, "command", false, 0 ]`</br>

- `name`:> `restore` must match what it is in `package.json`
- `value` & `type`:> 
  - If value `0` and type `"integer"`, it means its type is `integer` in `package.json`
  - If value `"abc"` and type `"string"`, it means its type is `string` in `package.json`
  - If value `true` and type `"boolean"`, it means its type is `bool` in `package.json`
  - If value `null` and type `"command"`, it means its type is `control` in `package.json`
    - `control` type don't have `value` in `package.json`
    - The command should be defined in `data/worker.js` as `exports.retore`, which should match its name `restore`
- `ignore`:> determines if it will be reset to default by `Restore Default` command
  - Don't set it to `true` if its type is `command`
- `group`:> determines the menuitem groups in toolbar button
  - If its `value` is string or integer, set it to `null`
  - Groups in toolbar button will be separated like: group0{menuitem1, menuitem3} | group1{menuitem2} | group2{menuitem0}
- `order`:> The order of the preferences in `Option` will affect the sort order in the toolbar button

##Website
Pattern `[ name, value, host, [ rules ] ]`</br>
Sample `[ "youku", 0, "youku.com", [ ["player", "loader.swf", 0, "http://static.youku.com/*/v/swf/loader*.swf*"], ["player", "player.swf", 0, "http://static.youku.com/*/v/swf/*player*.swf*"], ["filter", 1, "http://*.atm.youku.com/v*?vip=*"] ]`</br>

- `name`:> `youku` must match what it is in `package.json`
- `value`:> `1` means enable player rule, `2` means enable filter rule, `0` means disable all rules
- `host`:> `youku.com` means the host of "http://www.youku.com"
- `rule`:> Array of rule patterns.
  - `type`:> `player`:> means this rule is a player rule
    - `file`:> define the file name of the modded flash player, which is hosted on a remote server
    - `nofile`:> `1` to enable, `0` to disable, the value of `file` must be a accessable remote link
    - `pattern`:> matching pattern of the target, could be regular expression or string with wildcard
  - `type`:> `filter`:> means this rule is a filter rule
    - `secured`:> `1` to enable, `0` to disable, slower when enabled, but more compatible
    - `pattern`:> matching pattern of the target, could be regular expression or string with wildcard

##Wrapper
Pattern `[ type, major, [minor] ]`</br>
Sample `[ "fileter", "youku", ["tudou"] ]`</br>

- `type`:> which rule should be synchronized between target sites
- `major`:> the base Website[name], the other sites depends on its preference
- `minor`:> Array of Website[name], defines which sites should by sychronized to the major
