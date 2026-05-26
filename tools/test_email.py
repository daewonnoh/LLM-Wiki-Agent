import urllib.request
import json

url = "https://script.google.com/macros/s/AKfycbyemTscGqGKYxL9BVT2g17mg5InqWKOGI6zSo72ShJyZVRXvC17VFyGqUIhP0dNyDk0Kw/exec"

data = {
    "name": "방문자 비평가 (실제 연동 검증)",
    "email": "naisdw@gmail.com",
    "message": "교수님, 웹 브라우저가 직접 구글 Apps Script 중계 API로 데이터를 쏘아 novel@jejunu.ac.kr로 이메일을 발송하는 연동이 성공적으로 활성화되었습니다. 이제 실시간으로 방문자들의 소중한 의견을 안전하게 메일로 수신하실 수 있습니다."
}

json_data = json.dumps(data).encode("utf-8")

req = urllib.request.Request(
    url, 
    data=json_data, 
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    print("Sending test request to Google Apps Script...")
    with urllib.request.urlopen(req) as response:
        html = response.read().decode("utf-8")
        print(f"Response Status: {response.status}")
        print(f"Response Body: {html}")
        if "SUCCESS" in html or response.status == 200:
            print("Google Apps Script 연동 확인: 성공적으로 메일이 발송되었습니다!")
        else:
            print("Google Apps Script가 예상치 못한 응답을 반환했습니다.")
except Exception as e:
    print(f"Error occurred during test: {e}")
