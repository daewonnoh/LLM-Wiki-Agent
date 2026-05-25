from PIL import Image
import collections

img_path = "public/assets/webtoon/cognitive_space/image1.png"
try:
    img = Image.open(img_path)
    print("Format:", img.format)
    print("Mode:", img.mode)
    print("Size:", img.size)
    
    # 이미지 네 모퉁이의 픽셀 컬러 확인
    w, h = img.size
    pixels = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
        img.getpixel((w // 2, 0)),
        img.getpixel((0, h // 2)),
    ]
    print("Corner and border pixel colors:", pixels)
    
    # 투명도 채널이 있는지 확인
    if 'A' in img.mode:
        # 알파 채널 바운딩 박스 확인
        bbox = img.getbbox()
        print("Alpha channel bounding box:", bbox)
    else:
        print("No alpha channel.")
        
except Exception as e:
    print("Error analyzing image:", e)
