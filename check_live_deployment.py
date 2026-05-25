import urllib.request
import re

try:
    html = urllib.request.urlopen('https://daewonnoh.github.io/LLM-Wiki-Agent/').read().decode('utf-8')
    scripts = re.findall(r'src="(/LLM-Wiki-Agent/assets/[^"]+\.js)"', html)
    if scripts:
        js_url = 'https://daewonnoh.github.io' + scripts[0]
        print('Checking JS URL:', js_url)
        js_content = urllib.request.urlopen(js_url).read().decode('utf-8')
        
        # 1100px 가 포함되었는지 검증
        if '1100px' in js_content:
            print('SUCCESS: "1100px" found in live JS!')
            idx = js_content.find('1100px')
            print('Context around "1100px":')
            print(js_content[max(0, idx-100):min(len(js_content), idx+100)])
        else:
            print('FAIL: "1100px" NOT found in live JS.')
            
        # modal-backdrop 이 밖으로 나갔는지 확인하기 위한 context 분석
        # modal-backdrop이 footer 근처에 있는지 검증
        if 'modal-backdrop' in js_content:
            print('SUCCESS: "modal-backdrop" found in live JS!')
            idx = js_content.find('modal-backdrop')
            print('Context around "modal-backdrop":')
            print(js_content[max(0, idx-50):min(len(js_content), idx+150)])
    else:
        print('No script files found in HTML.')
except Exception as e:
    print('Error occurred:', e)
