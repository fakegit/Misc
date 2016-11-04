@ECHO OFF
TASKKILL /F /IM "aria2c.exe"
REG DELETE "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /V "Aria2" /F
REG DELETE "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" /V "Aria2" /F
