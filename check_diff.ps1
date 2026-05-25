$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    $diff = & $git diff eb2215e HEAD
    $diff | Out-File -FilePath diff.txt -Encoding utf8
} else {
    Write-Output "Git not found"
}
