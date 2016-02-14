##Option

Pattern `[name, value, ignore, group]`</br>
Sample1 `["restore", "command", false, 0]`</br>
Sample2 `["server", "", true, null]`</br>
Sample3 `["update", 0, true, null]`</br>

- `name`:> `restore`, `server` or `update` must match what it is in `package.json`
- `value`:> `command`, `""` or `0` is the value of whose in `package.json`
  - If it is an integer like `0` or others, it means its type is `integer` in `package.json`
  - If it is a string like `""`, it means its type is `string` in `package.json`
  - If it is a boolean like `true`, it means its type is `bool` in `package.json`
  - If it is `command`, it means its type is `control` in `package.json`
    - Function should be defined in `data/worker.js` as `exports.retore`, which should match its name `restore`
- `ignore`:> determines if it will be set to default by `Restore Default` command
  - Don't set it to `true` if its value is `command`
- `group`:> determines the menuitem groups in toolbar button
  - If its `value` is string or integer, set it to `null`
  - Groups in toolbar button will be separated by separator like: group0 | group1 | group2
- `order`:> The order of option will affect the sort order in the toolbar button

##Website

##Wrapper
