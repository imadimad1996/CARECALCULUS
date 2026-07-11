import re

with open('src/pages/Blog.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

result = []
skip = False

for line in lines:
    stripped = line.strip()
    # detect start of contentAr multi-line string
    if not skip and re.match(r'\s*contentAr:\s*`', line):
        skip = True
    if skip:
        # end of template literal with ,
        if stripped.endswith('`,') or stripped.endswith('`'):
            skip = False
        continue
    # Remove dead ar content check
    if 'false && activePost.contentAr' in line:
        continue
    result.append(line)

with open('src/pages/Blog.tsx', 'w', encoding='utf-8') as f:
    f.writelines(result)

print("Done")
