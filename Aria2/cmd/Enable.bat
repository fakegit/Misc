@ECHO OFF
TASKKILL /F /IM "aria2c.exe"
PUSHD %~DP0
CD..
REG ADD "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /V "Aria2" /T "REG_SZ" /D "%CD%\aria2.vbs" /F
START "" "%CD%\aria2.vbs"
START "" "%CD%\webui\index.html"
PAUSE
