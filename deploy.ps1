$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    & $git add .
    & $git commit -m "Fix missing styles for academic paper title section"
    & $git push
} else {
    Write-Output "Git not found"
}
