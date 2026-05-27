import urllib.request
import json

# 가장 최신 실패한 Actions run의 로그 확인
run_id = '26501146208'
url = f'https://api.github.com/repos/daewonnoh/LLM-Wiki-Agent/actions/runs/{run_id}/jobs'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req).read().decode('utf-8')
data = json.loads(res)

for job in data.get('jobs', []):
    print(f"잡: {job['name']} / 결론: {job.get('conclusion', 'N/A')}")
    for step in job.get('steps', []):
        status = step.get('conclusion', step.get('status', 'N/A'))
        print(f"  단계: {step['name']} -> {status}")
