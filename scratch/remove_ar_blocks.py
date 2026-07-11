import re
import os

src_dir = r"c:\Users\DeLL\CARECALCULUS\src"

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                c = file.read()
            
            original = c
            
            # Remove ar: {...} blocks from Translations objects (multi-line pattern)
            # This pattern matches `ar: {` ... `},` in a Translations object 
            c = re.sub(r'\s*ar:\s*\{[^}]+\},?\s*\n', '\n', c)
            
            # Remove .ar property accesses (e.g. t.ar, translations.ar etc.) - replace with .en
            # but ONLY when accessing translation properties like t.ar or translations.ar
            # We'll handle specific patterns after getting a clean view first
            
            if c != original:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(c)
                print(f"Fixed ar blocks in {f}")
