with open(r"C:\Users\naisd\.gemini\antigravity\scratch\literature-research-web\src\App.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

found = False
for i, line in enumerate(lines):
    if "const troublesData" in line or "let troublesData" in line:
        print(f"TroublesData starts at line {i+1}")
        found = True
        # print next 30 lines
        for j in range(i, min(i+40, len(lines))):
            print(f"{j+1}: {lines[j].strip()}")
        break

if not found:
    print("troublesData not found")
