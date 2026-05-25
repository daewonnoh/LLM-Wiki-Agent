$run = Invoke-RestMethod -Uri 'https://api.github.com/repos/daewonnoh/LLM-Wiki-Agent/actions/runs?per_page=1' -Headers @{'User-Agent'='Mozilla/5.0'} | Select-Object -ExpandProperty workflow_runs | Select-Object -First 1
Write-Output "Latest Run ID: $($run.id)"
Write-Output "  Status: $($run.status)"
Write-Output "  Conclusion: $($run.conclusion)"
Write-Output "  Commit Msg: $($run.head_commit.message)"
Write-Output "  Created At: $($run.created_at)"
