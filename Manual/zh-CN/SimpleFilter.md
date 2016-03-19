##注意

- 用户自行承担风险

##创建扩展

- 请阅读 <a href="https://goo.gl/9aM7i7">如何创建扩展</a>

## 使用说明

- 0) Simple Filter 使用全新 MatchPattern.jsm API
- 1) Simple Filter 规则包含 `前缀`, `次前缀`, `匹配对象`, `后缀`, `额外字符串`
<p><img src="http://i66.tinypic.com/fvxl05.png"></p>
    - 1.1.0) 用户可以使用 <a href="https://goo.gl/vt6Jj4">Simple Converter</a> 对 Adblock Plus 规则列表进行转换
    - 1.1.1) `前缀` $ 决定 拦截规则, `前缀` ^ 决定 重定向规则, `前缀` < 决定 修改请求头规则
    - 1.1.2) `次前缀` ! 决定规则是否将要被匹配, `次前缀` ? 决定规则是否为白名单
    - 1.1.3) 阅读资料, 如何编写 <a href="https://goo.gl/sZzTgN">`匹配对象`</a>
    - 1.1.4) `后缀` # 仅适用于 拦截规则, 速度稍慢但是效果更好
    - 1.1.5) `后缀` > 仅适用于 重定向规则, 其意味着 重定向至
    - 1.1.6) `后缀` @ 仅适用于 修改请求头规则
  - 1.2) 你最好阅读下 <a href="https://goo.gl/veiWJZ">Simple Filter 规则例表</a>
- 2） 可以通过添加 http:// 或 https:// 远程连接来订阅远程规则，支持base64编码的文件
  - 2.1） 例如 <a href="https://goo.gl/Nf0B0a">Simple Filter 规则表 (由卡饭论坛@523860169转换自cjx规则)</a>
  - 2.2） 订阅规则每4天自动更新一次
- 3） 可以通过 about:addons 设置界面的 `浏览...` 按钮来指定绝对路径中的文件
- 4） 可以通过 `file.txt` 来访问相对路径 `Profile\SimpleFilter\file.txt` 中的规则
- 5) 可以通过点击 `编辑：规则**` 来修改你的规则
  - 5.1) 如果你有修改规则，你需要先点击 `保存` 按钮，然后再 `关闭` 编辑器窗口
