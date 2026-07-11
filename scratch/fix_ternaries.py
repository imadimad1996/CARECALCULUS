import os
import re

src_dir = r"c:\Users\DeLL\CARECALCULUS\src"

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Replace `: lang === 'ar' ? something.ar : something.en` -> `: something.en`
    # or `: (lang === 'ar' ? something.ar : something.en)` -> `: something.en`
    # Let's use a non-greedy match for the true branch of the ternary
    content = re.sub(r':\s*\(?lang\s*===\s*[\'"]ar[\'"]\s*\?\s*[^:]+:\s*([^)\n]+)\)?', r': \1', content)
    
    # Replace `lang === 'ar' ? something.ar : something.en` -> `something.en`
    # For cases where it's not preceded by a colon (e.g. `const x = lang === 'ar' ? ...`)
    content = re.sub(r'\(?lang\s*===\s*[\'"]ar[\'"]\s*\?\s*[^:]+:\s*([^)\n]+)\)?', r'\1', content)

    # For `if (lang === 'ar') { ... } else if (lang === 'fr') { ... } else { ... }`
    # Actually, those are usually `else if (lang === 'ar') { ... }`
    # Let's just remove `else if (lang === 'ar') { ... }` blocks (simplistic, assuming no nested braces)
    # The regex for this might be brittle, so let's only do ternary replacements first, 
    # and handle others manually if there are only a few.

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed ternaries in {path}")

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            process_file(os.path.join(root, f))
