import os
import re
from pathlib import Path

PAGES_DIR = Path("src/pages")
COMPONENTS_DIR = Path("src/components")

def enhance_mobile(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    modified = False
    
    # 1. Enhance button touch targets (py-1 or py-2 -> py-3 or min-h-[44px])
    if "button" in content and "min-h-[44px]" not in content:
        content = content.replace("className=\"px-4 py-2", "className=\"px-4 py-3 min-h-[44px]")
        content = content.replace("className=\"px-3 py-1.5", "className=\"px-4 py-2.5 min-h-[44px]")
        content = content.replace("className=\"p-2", "className=\"p-3 min-h-[44px] min-w-[44px]")
        modified = True

    # 2. Enhance input touch targets
    if "<input" in content and "min-h-[44px]" not in content:
        content = content.replace("className=\"w-full px-3 py-2", "className=\"w-full px-4 py-3 min-h-[44px]")
        content = content.replace("className=\"w-full px-4 py-3", "className=\"w-full px-4 py-3.5 min-h-[48px]")
        modified = True
        
    # 3. Prevent horizontal overflow on mobile containers
    if "<div className=\"max-w-" in content and "max-w-full" not in content:
        content = content.replace("<div className=\"max-w-", "<div className=\"w-full max-w-full max-w-")
        modified = True

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[+] Mobile UI/UX Enriched: {filepath.name}")

if __name__ == "__main__":
    for p in list(PAGES_DIR.glob("*.tsx")) + list(COMPONENTS_DIR.glob("*.tsx")):
        enhance_mobile(p)
