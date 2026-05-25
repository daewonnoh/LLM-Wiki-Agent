import urllib.request
import re

# 배포된 사이트의 HTML 가져오기
html = urllib.request.urlopen('https://daewonnoh.github.io/LLM-Wiki-Agent/').read().decode('utf-8')
scripts = re.findall(r'src="(/LLM-Wiki-Agent/assets/[^"]+\.js)"', html)
print('JS 파일들:', scripts)

if scripts:
    js_url = 'https://daewonnoh.github.io' + scripts[0]
    js_content = urllib.request.urlopen(js_url).read().decode('utf-8')
    # 메뉴 순서 확인
    if 'maps' in js_content and 'explorer' in js_content:
        maps_pos = js_content.find('"maps"')
        explorer_pos = js_content.find('"explorer"')
        print(f'maps 위치: {maps_pos}, explorer 위치: {explorer_pos}')
        if maps_pos < explorer_pos:
            print('메뉴 순서: maps -> explorer (올바름)')
        else:
            print('메뉴 순서: explorer -> maps (아직 예전 버전)')
    # timeline 기본값 확인
    if 'timeline' in js_content:
        print('timeline 기본값: 있음')
    else:
        print('timeline 기본값: 없음 (아직 예전 버전)')
