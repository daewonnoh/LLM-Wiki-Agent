$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    Write-Output "Resetting to 6a46197..."
    & $git reset --hard 6a46197
} else {
    Write-Output "Git not found"
}
