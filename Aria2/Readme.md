
- 通过`cmd\Enable.bat`添加开机启动项并同时启动Aria2及Web UI
  
  **请Pin住已启动好的Web UI标签页方便使用**

- 通过`cmd\Disable.bat`删除开机启动项并终止Aria2

- 当Aria2无法启动时请尝试使用`cmd\Session.bat`清理任务列表

  **部分任务因为文件丢失可能导致Aria2无法启动，或启动后无法监听RPC请求**

- 请按照说明对`aria2.conf`进行自定义修改，否则aria2可能无法在你的电脑上工作

  * 将`dir=Z:\Aria2`中的`Z:\Aria2`改为自己的下载路径

  * 若想加密RPC请求的传输请将`rpc-certificate=aria2.p12`中的`aria2.p12`改为自己的个人证书路径

     **若不想加密RPC请求或没有个人证书，请在本行前面添加`#`，并同时在`rpc-secure=true`前添加`#`**

  * 请将`rpc-secret=aria2`中的`aira2`修改为自己使用的Token密钥，以防止被他人滥用

