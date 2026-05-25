$git = (Get-ChildItem -Path C:\Users\naisd\AppData\Local\GitHubDesktop -Filter git.exe -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -match 'cmd\\git.exe$' } | Select-Object -First 1).FullName
if ($git) {
    $content = & $git show e69b36f:src/App.jsx
    $content | Select-String "critiqueText" | Out-File -FilePath show_init_critique.txt -Encoding utf8
}
