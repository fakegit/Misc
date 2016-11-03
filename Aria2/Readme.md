#使用前请参考本说明对 `aria2.conf` 进行修改


- 请将`dir=Z:\Aria2`中的`Z:\Aria2`改为自己的下载路径

- 请将`rpc-certificate=aria2.p12`中的`aria2.p12`改为自己的个人证书路径

  **若没有请在本行前面添加`#`，并同时在`rpc-secure=true`前添加`#`**

- 请将`rpc-secret=aria2`中的`aira2`修改为自己使用的Token密钥

- 当Aria2无法启动时请尝试使用`session.bat`清理任务列表

  **部分任务因为文件丢失可能导致Aria2无法启动，或启动后无法监听RPC请求**
