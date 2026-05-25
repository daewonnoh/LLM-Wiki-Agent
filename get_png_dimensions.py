import struct
import os

def get_png_width_height(file_path):
    try:
        with open(file_path, 'rb') as f:
            sig = f.read(8)
            if sig != b'\x89PNG\r\n\x1a\n':
                return "Not a valid PNG", ""
            f.read(4)  # chunk length
            chunk_type = f.read(4)
            if chunk_type != b'IHDR':
                return "No IHDR", ""
            width = struct.unpack('>I', f.read(4))[0]
            height = struct.unpack('>I', f.read(4))[0]
            return width, height
    except Exception as e:
        return f"Error: {e}", ""

print("--- Cognitive Space PNGs ---")
for i in range(1, 21):
    path = f"public/assets/webtoon/cognitive_space/image{i}.png"
    if os.path.exists(path):
        w, h = get_png_width_height(path)
        print(f"image{i}.png: {w} x {h}")
    else:
        print(f"image{i}.png: File not found")

print("\n--- Greta PNGs ---")
for i in range(1, 21):
    path = f"public/assets/webtoon/greta/image{i}.png"
    if os.path.exists(path):
        w, h = get_png_width_height(path)
        print(f"image{i}.png: {w} x {h}")
    else:
        print(f"image{i}.png: File not found")
