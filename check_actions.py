import urllib.request
import json

# GitHub Actions 최신 실행 상태 확인
url = 'https://api.github.com/repos/daewonnoh/LLM-Wiki-Agent/actions/runs?per_page=5'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req).read().decode('utf-8')
data = json.loads(res)

for run in data.get('workflow_runs', []):
    print(f"ID: {run['id']}")
    print(f"  이름: {run['name']}")
    print(f"  상태: {run['status']} / 결론: {run.get('conclusion', 'N/A')}")
    print(f"  커밋: {run['head_sha'][:8]} - {run['head_commit']['message']}")
    print(f"  시각: {run['created_at']}")
    print()
