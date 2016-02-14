##Option

Pattern `[name, value, ignore, group]`</br>
Sample `["restore", "command", false, 0]`</br>

- `name`:> `restore` must match what it is in `package.json`
- `value`:> `command` is the value of whose in `package.json`
  - If it is integer like `0`, it means its type is `integer` in `package.json`
  - If it is string like `""`, it means its type is `string` in `package.json`
  - If it is boolean like `true`, it means its type is `bool` in `package.json`
  - If it is `command`, it means its type is `control` in `package.json`
    - `control` type don't have `value` in `package.json`
    - The command should be defined in `data/worker.js` as `exports.retore`, which should match its name `restore`
- `ignore`:> determines if it will be reset to default by `Restore Default` command
  - Don't set it to `true` if its value is `command`
- `group`:> determines the menuitem groups in toolbar button
  - If its `value` is string or integer, set it to `null`
  - Groups in toolbar button will be separated like: group0{menuitem1, menuitem3} | group1{menuitem2} | group2{menuitem0}
- `order`:> The order of the preferences in `Option` will affect the sort order in the toolbar button

##Website

##Wrapper
