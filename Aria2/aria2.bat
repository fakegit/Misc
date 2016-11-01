@ECHO OFF
TASKLIST|FINDSTR "aria2c.exe">NUL
IF %ERRORLEVEL% NEQ 0 (
  START "" "%~DP0aria2\aria2c.exe" --conf=aria2.conf
)
START "" "%~DP0webui\index.html"
