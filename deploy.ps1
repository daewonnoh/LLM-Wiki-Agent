$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    & $git add .
    & $git commit -m "Fix cognitive space webtoon shrinking by adding minWidth 1100px and overflowX auto"
    & $git push
} else {
    Write-Output "Git not found"
}
