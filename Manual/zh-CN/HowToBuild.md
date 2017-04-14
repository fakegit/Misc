# 如何创建扩展

## 前提

安装[npm](https://nodejs.org/download/release/latest/)，推荐下载`msi`安装包

## 方法
- 1) 运行 Node.js command prompt
  - 1) 运行 `npm install jpm -global` 以安装 jpm (目前 1.0.5)
  - 2) 下载并解压源代码到 X:\yyyyy\zzzzz
  - 3) 输入 `cd /d X:\yyyyy\zzzzz` 选择你展开源代码的文件夹
  - 4) 运行 `jpm xpi` 命令以创建扩展 .xpi 文件
    - 1) 基于 Add-ons SDK 的附加组件将自动生成 my-addon.xpi, 及 my-addon.update.rdf
    - 2) 传统旧式附加组件将只生成 null.xpi
  - 5) 将 my-addon.xpi(null.xpi) 上传至 AMO 获取签名
  - 6) 运行 `jpm sign` 以给扩展签名
    - 1) 使用 `--xpi` 命令行参数来指定已生成的扩展文件
    - 2) 基于 Add-ons SDK 的附加组件可以省略 `jpm xpi`
  - 7) 你可能需要 .jpmignore 以跳过一些创建扩展时不必要的文件
- 2) 运行 `make.cmd` 直接创建扩展
  -1) 若未安装`jpm`，将自动下载并安装`jpm`
  -2) 部分repository并未提供`make.cmd`
