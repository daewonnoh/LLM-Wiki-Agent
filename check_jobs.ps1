$logUrl = "https://api.github.com/repos/daewonnoh/LLM-Wiki-Agent/actions/jobs/77696230267/logs"
try {
    $logText = Invoke-RestMethod -Uri $logUrl -Headers @{'User-Agent'='Mozilla/5.0'}
    $lines = $logText -split "`n"
    $lastLines = $lines[-100..-1]
    foreach ($line in $lastLines) {
        Write-Output $line
    }
} catch {
    Write-Output "Error: $_"
}
