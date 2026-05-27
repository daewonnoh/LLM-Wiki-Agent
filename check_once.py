import urllib.request
import re

try:
    html = urllib.request.urlopen('https://daewonnoh.github.io/LLM-Wiki-Agent/').read().decode('utf-8')
    scripts = re.findall(r'src="(/LLM-Wiki-Agent/assets/[^"]+\.js)"', html)
    if scripts:
        print('발견된 스크립트 목록:', scripts)
        js_url = 'https://daewonnoh.github.io' + scripts[0]
        print('가장 최신 JS 파일 조회:', js_url)
        js = urllib.request.urlopen(js_url).read().decode('utf-8')
        keyword = '교육 확산 (대학원 프로젝트)'
        if keyword in js:
            print(f'성공: 라이브 웹사이트에 "{keyword}" 키워드가 존재합니다!')
        else:
            print(f'실패: 아직 라이브 웹사이트에 "{keyword}" 키워드가 없습니다.')
    else:
        print('HTML에서 스크립트 태그를 찾지 못했습니다.')
except Exception as e:
    print('오류 발생:', e)
