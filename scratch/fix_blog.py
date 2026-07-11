import re
with open('src/pages/Blog.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'\s*titleAr:\s*mb\.title\.ar,', '', c)
c = re.sub(r'\s*snippetAr:\s*mb\.snippet\.ar,', '', c)

with open('src/pages/Blog.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
