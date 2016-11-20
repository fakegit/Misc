

Function CurrentPath()
    strPath = Wscript.ScriptFullName
    Set objFSO = CreateObject("Scripting.FileSystemObject")
    Set objFile = objFSO.GetFile(strPath)
    CurrentPath = objFSO.GetParentFolderName(objFile)
End Function


appExecutable = """" & CurrentPath() & "\aria2.bat" & """"
'WScript.Echo appExecutable


Set oShell = CreateObject ("Wscript.Shell")
oShell.Run appExecutable, false
