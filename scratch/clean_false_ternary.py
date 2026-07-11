import os
import re

src_dir = r"c:\Users\DeLL\CARECALCULUS\src"

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original = content
            
            # Replace `: false ? ... : ...`
            # For example: `: false ? tag.ar : tag.en` -> `: tag.en`
            content = re.sub(r':\s*false\s*\?\s*[^:]+:\s*([^)\n]+)', r': \1', content)
            
            # Replace without colon
            # `false ? tag.ar : tag.en` -> `tag.en`
            content = re.sub(r'false\s*\?\s*[^:]+:\s*([^)\n]+)', r'\1', content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Cleaned false ternaries in {f}")
