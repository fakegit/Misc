## 注意

- 用户自行承担风险

## 创建扩展

- 请阅读 [如何创建扩展](https://github.com/jc3213/Misc/blob/master/Manual/zh-CN/HowToBuild.md)

## 使用说明

- 0) Simple Proxy 不会覆盖 Firefox 本身的代理设置
- 1) Simple Proxy 完全兼容 Auto Proxy 规则列表
  - 1) 支持base64编码的文件
- 2) 服务器必须满足 类型::地址::端口 的格式
  - 1) 例如 `socks::127.0.0.1::1080`
  - 2) 支持的协议类型 `http`, `socks`, `socks4`
    - 1) `http`, HTTP 及 HTTPS 协议
    - 2) `socks`, SOCKS V5 协议
    - 3) `socks4`, SOCKS V4 协议
- 3) 可以通过添加 http:// 或 https:// 远程连接来订阅远程规则
  - 1) 例如 [GFWList](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt) (分支 ESR)
  - 2) 订阅规则每4天自动更新一次
  - 3) 规则仅支持`.txt`和`.ini`后缀
- 4) 可以通过 about:addons 设置界面的 `浏览...` 按钮来指定绝对路径中的文件
- 5) 可以通过 `file.txt` 来访问相对路径 Profile\SimpleProxy\file.txt 中的规则
- 6) 可以通过点击`编辑`来修改你的规则
  - 1) 如果你有修改规则，你需要点击`保存`
  - 2) 火狐安卓版和雷鸟无法使用`编辑`功能
- 7) 你可以通过点击`重置`来清理掉不再使用的档案
