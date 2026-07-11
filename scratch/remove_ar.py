import os
import json
import re

src_dir = r"c:\Users\DeLL\CARECALCULUS\src"

def remove_ar_key(content):
    # Only match ar: if it is preceded by a whitespace, comma, or brace.
    # This prevents matching something like `post.title.ar :`
    pattern = re.compile(r'(?<=[\s,{])([\'"]?ar[\'"]?\s*:\s*)')
    
    while True:
        match = pattern.search(content)
        if not match:
            break
            
        start_idx = match.start(1)
        
        # Determine where the preceding comma was, if any, to optionally remove it
        # Backtrack to find if there's a comma before this key (skipping whitespace)
        preceding_comma_idx = -1
        idx = start_idx - 1
        while idx >= 0 and content[idx] in (' ', '\t', '\n', '\r'):
            idx -= 1
        if idx >= 0 and content[idx] == ',':
            preceding_comma_idx = idx

        value_start = match.end(1)
        
        char = content[value_start]
        if char == '{':
            depth = 1
            idx = value_start + 1
            while depth > 0 and idx < len(content):
                if content[idx] == '{':
                    depth += 1
                elif content[idx] == '}':
                    depth -= 1
                idx += 1
            end_idx = idx
        elif char == '[':
            depth = 1
            idx = value_start + 1
            while depth > 0 and idx < len(content):
                if content[idx] == '[':
                    depth += 1
                elif content[idx] == ']':
                    depth -= 1
                idx += 1
            end_idx = idx
        elif char in ('"', "'", "`"):
            quote = char
            idx = value_start + 1
            while idx < len(content):
                if content[idx] == '\\':
                    idx += 2
                    continue
                if content[idx] == quote:
                    idx += 1
                    break
                idx += 1
            end_idx = idx
        else:
            idx = value_start
            while idx < len(content) and content[idx] not in (',', '}', ']'):
                idx += 1
            end_idx = idx

        trailing_idx = end_idx
        while trailing_idx < len(content) and content[trailing_idx] in (' ', '\t', '\n', '\r'):
            trailing_idx += 1
            
        has_trailing_comma = trailing_idx < len(content) and content[trailing_idx] == ','
        
        if has_trailing_comma:
            end_idx = trailing_idx + 1
            content = content[:start_idx] + content[end_idx:]
        else:
            if preceding_comma_idx != -1:
                content = content[:preceding_comma_idx] + content[end_idx:]
            else:
                content = content[:start_idx] + content[end_idx:]
            
    return content

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = remove_ar_key(content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {f}")

trans_path = os.path.join(src_dir, 'data', 'translations.json')
if os.path.exists(trans_path):
    with open(trans_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'ar' in data:
        del data['ar']
        with open(trans_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Updated translations.json")
