##Option

格式 `[name, value, ignore, group]`</br>
样例 `["restore", "command", false, 0]`</br>

- `name`:> `restore` 必须对应 `package.json` 中的 name
- `value`:> `command` 必须对应 `package.json` 中的 value
  - 如果值为类似 `0` 的整数型, 那么其在 `package.json` 中的 type 为 `integer`
  - 如果值为类似 `""` 的字符串, 那么其在 `package.json` 中的 type 为 `string`
  - 如果值为类似 `true` 的布尔值, 那么其在 `package.json` 中的 type 为 `bool`
  - 如果值为 `command`, 那么其在 `package.json` 中的 type 为 `control`
    - `control` type 在 `package.json` 中并不包含 value
    - 相关 command 必须以 `exports.retore` 格式定义在 `data/worker.js` 中, 请务必匹配 name `restore`
- `ignore`:> 决定其是否被 `恢复初始值` 命令重设初始值
  - 如果 value 是 `command`, 请勿设置为 `true`
- `group`:> 决定其在工具栏按钮中的分组
  - 如果 `value` 类型为 整数型 或者 字符串, 请设置为 `null`
  - 工具栏按钮中的菜单将被分割为: 小组0{菜单1, 菜单3} | 小组1{菜单2} | 小组2{菜单0}
- `order`:> `Option` 中的设置的顺序将影响其在工具栏按钮中的顺序

##Website

##Wrapper
