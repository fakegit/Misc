#如何创建扩展

##扩展类型
- 基于 Add-ons SDK 的附加组件包含 package.json 文件, 并且一般不包含 install.rdf 与 bootstrap.js 文件
- 传统旧式附加组件不包含 package.json 文件, 而且一般默认包含 install.rdf 文件, 无需重启的扩展包含 bootstrap.js 文件

##操作步骤
- 1) 安装`npm` (别称 nodejs)
- 2) 运行 Node.js command prompt
  - 2.1) 运行 `npm install jpm -global` 以安装 jpm (目前 1.0.5)
- 3) 下载并解压源代码到 X:\yyyyy\zzzzz
- 4) 输入 `cd /d X:\yyyyy\zzzzz` 选择你展开源代码的文件夹
- 5) 运行 `jpm xpi` 命令以创建扩展
  - 5.1.1) 基于 Add-ons SDK 的附加组件将自动生成 my-addon.xpi, 及 my-addon.update.rdf
  - 5.1.2) 传统旧式附加组件将只生成 null.xpi
  - 5.2) 将 my-addon.xpi(null.xpi) 上传至 AMO 获取签名
- 6) 运行 `jpm sign` 命令以创建已签名的扩展
  - 6.1) 基于 Add-ons SDK 的附加组件可以省略 步骤 5)
  - 6.2) 传统旧式附加组件必须添加 `--xpi` 命令行参数来签名 null.xpi(或其他xpi文件)
- 7) 你可能需要 .jpmignore 以跳过一些创建扩展时不必要的文件

#重要说明

##基于 Add-ons SDK 的 附加组件
- 1) 你必须修改 package.json 中的 UUID
- 2) 你必须修改或删除 package.json 中的 updateURL, updateLink, updateKey 键值
  - 2.1) 如果使用 updateKey, 你必须参考 <a href="https://goo.gl/hHAx3m">Update.rdf</a> 修改 version 和 updateLink 后再用 McCoy 签名

<p><img src="http://i66.tinypic.com/ml5abm.png"></p>

##旧式 附加组件
- 1) 你必须修改 install.rdf 中的 UUID
- 2) 你必须修改或删除 install.rdf 中的 updateURL 键值
- 3) 你必须修改或删除 update.rdf 中的 updateLink 键值
- 4) install.rdf 中的 updateKey 键值 与 Update.rdf 中的 signature 键值由 McCoy 签署颁发
  - 4.1) 如果你将文件上传至 支持 SSL加密 的服务器上则不需要使用 McCoy

<p><img src="http://i68.tinypic.com/29zzcpv.png"></p>
<p><img src="http://i67.tinypic.com/6944dl.png"></p>>
