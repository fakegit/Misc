


Function CurrentPath()
    strPath = Wscript.ScriptFullName
    Set objFSO = CreateObject("Scripting.FileSystemObject")
    Set objFile = objFSO.GetFile(strPath)
    CurrentPath = objFSO.GetParentFolderName(objFile)
End Function


Function isConsole()
    Set objArgs = Wscript.Arguments
    'WScript.Echo objArgs.Count
    'WScript.Echo objArgs(0)
    isConsole = 0
    If objArgs.Count > 0 Then
        if objArgs(0) = "console" Then
            isConsole = 1
        End If
    End If
End Function


strCurrentPath = CurrentPath()
Dim strArgs
quo = """"

strExecutable = quo & strCurrentPath & "\aria2.bat" & quo
'strArgs = strExecutable
'WScript.Echo strArgs

Set oShell = CreateObject ("Wscript.Shell")
oShell.Run strExecutable, false
