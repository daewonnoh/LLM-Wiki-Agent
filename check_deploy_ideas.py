import urllib.request
import re
import sys
import time

url = 'https://daewonnoh.github.io/LLM-Wiki-Agent/'
print('라이브 배포 확인을 시작합니다:', url)

# GitHub Actions가 완료될 때까지 여러 번 재시도할 수 있도록 루프를 구성합니다.
# 최대 5번, 20초 간격으로 재시도합니다.
for attempt in range(1, 7):
    print(f'\n[시도 {attempt}/6] 라이브 JS 번들 분석 중...')
    try:
        html = urllib.request.urlopen(url).read().decode('utf-8')
        scripts = re.findall(r'src="(/LLM-Wiki-Agent/assets/[^"]+\.js)"', html)
        if scripts:
            js_url = 'https://daewonnoh.github.io' + scripts[0]
            print('분석 대상 JS URL:', js_url)
            js_content = urllib.request.urlopen(js_url).read().decode('utf-8')
            
            # "교육 확산" 또는 "대학원 프로젝트" 텍스트가 포함되어 있는지 검증
            target_keyword = "교육 확산 (대학원 프로젝트)"
            if target_keyword in js_content:
                print(f'성공: 라이브 JS에서 "{target_keyword}" 문구를 발견했습니다!')
                idx = js_content.find(target_keyword)
                print('발견 문구 주변 콘텍스트:')
                print(js_content[max(0, idx-100):min(len(js_content), idx+100)])
                sys.exit(0)
            else:
                print(f'대기 중: 라이브 JS에서 "{target_keyword}" 문구를 찾지 못했습니다. 이전 버전이 유지되고 있을 수 있습니다.')
        else:
            print('HTML에서 스크립트 파일을 찾지 못했습니다.')
    except Exception as e:
        print('에러 발생:', e)
    
    if attempt < 6:
        print('20초 후에 다시 확인합니다...')
        time.sleep(20)

print('\n배포 반영 확인 실패: 지정된 대기 시간 내에 새로운 코드가 반영되지 않았습니다. 잠시 후 직접 웹페이지를 확인해 주세요.')
sys.exit(1)
