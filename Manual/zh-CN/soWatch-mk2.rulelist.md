##Option

格式 `[name, value, ignore, group]`</br>
样例 `["restore", "command", false, 0]`</br>

- `name`:> `restore` 必须对应 `package.json` 中的 name
- `value` & `type`:> `command` 必须对应 `package.json` 中的 value
  - 如果值为 `0` 类型为 `"integer"` , 那么其在 `package.json` 中的 type 为 `integer`
  - 如果值为 `"abc"` 类型为 `"string"` , 那么其在 `package.json` 中的 type 为 `string`
  - 如果值为 `true` 类型为 `"boolean"` , 那么其在 `package.json` 中的 type 为 `bool`
  - 如果值为 `null` 类型为 `"command"` , 那么其在 `package.json` 中的 type 为 `control`
    - `control` type 在 `package.json` 中并不包含 value
    - 相关 command 必须以 `exports.retore` 格式定义在 `data/worker.js` 中, 请务必匹配 name `restore`
- `ignore`:> 决定其是否被 `恢复初始值` 命令重设初始值
  - 如果 value 是 `command`, 请勿设置为 `true`
- `group`:> 决定其在工具栏按钮中的分组
  - 如果 `value` 类型为 整数型 或者 字符串, 请设置为 `null`
  - 工具栏按钮中的菜单将被分割为: 小组0{菜单1, 菜单3} | 小组1{菜单2} | 小组2{菜单0}
- `order`:> `Option` 中的设置的顺序将影响其在工具栏按钮中的顺序

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
