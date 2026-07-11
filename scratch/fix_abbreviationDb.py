import re
with open('src/utils/abbreviationDb.ts', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r',\s*ar:\s*"[^"]+"', '', c)
with open('src/utils/abbreviationDb.ts', 'w', encoding='utf-8') as f:
    f.write(c)
