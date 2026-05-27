import urllib.request

try:
    html = urllib.request.urlopen('https://daewonnoh.github.io/LLM-Wiki-Agent/').read().decode('utf-8')
    print('HTML 크기:', len(html))
    print('HTML 처음 500자:')
    print(html[:500])
    print('HTML 마지막 500자:')
    print(html[-500:])
    print('script 단어가 들어간 부분들:')
    for line in html.split('\n'):
        if 'script' in line or 'assets' in line:
            print('  Line:', line.strip())
except Exception as e:
    print('오류:', e)
