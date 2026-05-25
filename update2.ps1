$mdPath = 'F:\내 드라이브\!LLM Wiki_AI와 문학 연구\Papers\2026-05-24-트러블과함께읽기-대원(학회 양식).md'
$jsPath = 'C:\Users\naisd\.gemini\antigravity\scratch\literature-research-web\src\data\manuscript.js'
$content = [System.IO.File]::ReadAllText($mdPath, [System.Text.Encoding]::UTF8)
$content = $content.Replace([char]96, '\`').Replace('$', '\$')
$jsContent = 'export const manuscriptText = ' + [char]96 + $content + [char]96 + ';'
[System.IO.File]::WriteAllText($jsPath, $jsContent, [System.Text.Encoding]::UTF8)
Write-Output 'Updated Successfully!'
