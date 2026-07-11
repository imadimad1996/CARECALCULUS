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
            
            # Replace lang === 'ar' with false
            content = re.sub(r'lang\s*===\s*[\'"]ar[\'"]', 'false', content)
            
            # Replace lang !== 'ar' with true
            content = re.sub(r'lang\s*!==\s*[\'"]ar[\'"]', 'true', content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Patched ar checks in {f}")
