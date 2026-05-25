import urllib.request
import json

url = "https://api.github.com/repos/daewonnoh/LLM-Wiki-Agent/commits"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        commits = json.loads(response.read().decode('utf-8'))
        for i, c in enumerate(commits[:5]):
            print(f"COMMIT {i+1}: {c['commit']['message']} by {c['commit']['author']['name']} at {c['commit']['author']['date']}")
except Exception as e:
    print(f"FAILED TO FETCH: {e}")
