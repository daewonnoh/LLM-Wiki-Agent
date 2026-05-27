import json

path = 'C:/Users/user/.gemini/antigravity-ide/brain/5a02e648-126a-4e43-a37e-c25a6bfe7de0/.system_generated/logs/transcript.jsonl'
with open('C:/Users/user/Documents/GitHub/LLM-Wiki-Agent/transcript_parse.md', 'w', encoding='utf-8') as out:
    with open(path, encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT':
                    text = data.get('content', '')
                    if '사용 예시' in text or '차례대로 배치' in text:
                        out.write(text + "\n=====\n")
            except:
                pass
