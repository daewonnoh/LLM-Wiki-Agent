$mdPath = 'F:\내 드라이브\!LLM Wiki_AI와 문학 연구\Papers\2026-05-24-트러블과함께읽기-대원(학회 양식).md'
$jsPath = 'C:\Users\naisd\.gemini\antigravity\scratch\literature-research-web\src\data\manuscript.js'

$content = [System.IO.File]::ReadAllText($mdPath, [System.Text.Encoding]::UTF8)

# In PowerShell, a literal backtick in a single-quoted string is just '`'
$content = $content.Replace('`', '\`')
$content = $content.Replace('$', '\$')

# Use single quotes for the JS wrapper to avoid PowerShell variable expansion
$prefix = 'export const manuscriptText = `';
$suffix = '`;';

$jsContent = $prefix + $content + $suffix

[System.IO.File]::WriteAllText($jsPath, $jsContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated manuscript.js"
