import urllib.request

def check_image_urls(novel_name, folder_name):
    print(f"\n--- Checking {novel_name} Images ---")
    success_count = 0
    fail_count = 0
    for i in range(1, 21):
        url = f"https://daewonnoh.github.io/LLM-Wiki-Agent/assets/webtoon/{folder_name}/image{i}.png"
        try:
            req = urllib.request.Request(url, method='HEAD')
            res = urllib.request.urlopen(req)
            if res.status == 200:
                # Content-Length 확인
                content_length = res.getheader('Content-Length')
                print(f"Image {i}: OK (Status 200, size: {content_length} bytes)")
                success_count += 1
            else:
                print(f"Image {i}: Unexpected status {res.status}")
                fail_count += 1
        except Exception as e:
            print(f"Image {i}: FAILED to fetch - {e} - URL: {url}")
            fail_count += 1
            
    print(f"Summary for {novel_name}: {success_count} succeeded, {fail_count} failed.")

check_image_urls("김초엽 인지 공간", "cognitive_space")
check_image_urls("듀나 그레타 복음", "greta")
