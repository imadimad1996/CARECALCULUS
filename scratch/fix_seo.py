import re
with open('src/utils/seo.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r',\s*ar:\s*mj\.title\.ar', '', c)
c = re.sub(r',\s*ar:\s*mj\.snippet\.ar', '', c)
c = re.sub(r'\s*titleAr:\s*mb\.title\.ar,', '', c)
c = re.sub(r'\s*snippetAr:\s*mb\.snippet\.ar,', '', c)

with open('src/utils/seo.ts', 'w', encoding='utf-8') as f:
    f.write(c)
