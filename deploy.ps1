$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    & $git add .
    & $git commit -m "Link intro video 'trouble_intro.mp4' to research maps tab"
    & $git push
} else {
    Write-Output "Git not found"
}
