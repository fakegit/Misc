##Option

格式 `[name, value, type, reset, group]`</br>
样例 `["restore", null, "command", null, 0]`</br>

- `name`:> `restore` 必须对应 `package.json` 中的 name
- `value` & `type`:> `command` 必须对应 `package.json` 中的 value
  - 如果值为 `0` 类型为 `"integer"` , 那么其在 `package.json` 中的 type 为 `integer`
  - 如果值为 `"abc"` 类型为 `"string"` , 那么其在 `package.json` 中的 type 为 `string`
  - 如果值为 `true` 类型为 `"boolean"` , 那么其在 `package.json` 中的 type 为 `bool`
  - 如果值为 `null` 类型为 `"command"` , 那么其在 `package.json` 中的 type 为 `control`
    - `control` type 在 `package.json` 中并不包含 value
    - 相关 command 必须以 `exports.retore` 格式定义在 `data/worker.js` 中, 请务必匹配 name `restore`
- `reset`:> 决定其是否被 `恢复初始值` 命令重设初始值
  - 如果类型是 `command`, 请设置为 `null`
- `group`:> 决定其在工具栏按钮中的分组
  - 如果 `value` 类型为 整数型 或者 字符串, 请设置为 `null`
  - 工具栏按钮中的菜单将被分割为: 小组0{菜单1, 菜单3} | 小组1{菜单2} | 小组2{菜单0}
- `order`:> `Option` 中的设置的顺序将影响其在工具栏按钮中的顺序

##Website
格式 `[ name, value, host, [ rules ] ]`</br>
样例 `[ "youku", 0, "youku.com", [ ["player", "loader.swf", 0, "http://static.youku.com/*/v/swf/loader*.swf*"], ["player", "player.swf", 0, "http://static.youku.com/*/v/swf/*player*.swf*"], ["filter", 1, "http://*.atm.youku.com/v*?vip=*"] ]`</br>

- `name`:> `youku` 必须对应 `package.json`
- `value`:> `1` 表示启用 player 规则, `2` 表示启用 filter 规则, `0` 表示禁用所有规则
- `host`:> `youku.com` 是 `http://www.youku.com` 的 Host
- `rule`:> 规则以 数组 形式存在
  - `type`:> `player`:> 代表本规则为 player 规则
    - `file`:> 指代 播放器 的文件名，它必须被储存在远程服务器上。
    - `fullpath`:> `1` 启用, `0` 禁用, 若启用 `file` 必须必须是完整的路径
    - `pattern`:> 匹配规则，可以是正则表达式，也可以是含有 * 的字符串
  - `type`:> `filter`:> 代表本规则为 filter 规则
    - `secured`:> `1` 启用, `0` 禁用, 若启用 过滤速度会变慢但兼容更好
    - `pattern`:> 匹配规则，可以是正则表达式，也可以是含有 * 的字符串

##Wrapper
格式 `[ type, major, [minor] ]`</br>
样例 `[ "fileter", "youku", ["tudou"] ]`</br>

- `type`:> 指代将会被同步修改的规则的种类
- `major`:> 参照物 Website[name], 其他网站的指定类型规则将同步被修改
- `minor`:> 对象物 Website[name], 数组类型 用于指定规则会被同步修改的目标
